/**
 * Lints typescript text
 * From https://github.com/palantir/tslint-playground/blob/master/src/linter.ts
 */

import {
  getSourceFile,
  IRule,
  LintResult,
  removeDisabledFailures,
  RuleFailure,
  RuleSeverity
} from 'tslint';
import { DEFAULT_CONFIG, IConfigurationFile } from 'tslint/lib/configuration';
import { Formatter as StylishFormatter } from 'tslint/lib/formatters/stylishFormatter';
import { flatMap } from 'tslint/lib/utils';
import { SourceFile } from 'typescript';

import { IOptions } from 'tslint/lib/language/rule/rule';
import { AbstractRule } from 'tslint/lib/rules';

/**
 * Lints a typescript string
 * @param source Typescript string
 * @param configuration Config file, merged with default
 */
export default async function runLint(
  source: string,
  configuration: IConfigurationFile = DEFAULT_CONFIG
): Promise<LintResult> {
  const sourceFile = getSourceFile('file.ts', source);
  const ruleSet = getRuleSet(configuration);
  const enabledRules = await getRules(ruleSet, configuration.rules);

  const failures = getAllFailures(sourceFile, enabledRules);
  if (failures.length === 0) {
    return {
      errorCount: 0,
      warningCount: 0,
      failures: [],
      format: '',
      output: '',
    };
  }

  // add rule severity to failures
  const ruleSeverityMap = new Map(
    enabledRules.map(
      (rule): [string, RuleSeverity] => [
        rule.getOptions().ruleName,
        rule.getOptions().ruleSeverity,
      ]
    )
  );

  for (const failure of failures) {
    const severity = ruleSeverityMap.get(failure.getRuleName());
    if (severity === undefined) {
      throw new Error(`Severity for rule '${failure.getRuleName()}' not found`);
    }
    failure.setRuleSeverity(severity);
  }

  const errors = failures.filter(
    (failure) => failure.getRuleSeverity() === 'error'
  );
  const errorCount = errors.length;
  return {
    errorCount,
    failures,
    format: 'stylish',
    output: new StylishFormatter().format(failures),
    warningCount: failures.length - errorCount,
  };
}

function getAllFailures(
  sourceFile: SourceFile,
  enabledRules: IRule[]
): RuleFailure[] {
  const failures = flatMap(enabledRules, (rule) => applyRule(rule, sourceFile));
  return removeDisabledFailures(sourceFile, failures);
}

function applyRule(rule: IRule, sourceFile: SourceFile): RuleFailure[] {
  try {
    return rule.apply(sourceFile);
  } catch (error) {
    return [];
  }
}

const RULESETS = ['recommended', 'all', 'latest'];
const EXCLUDED_RULES = ['no-implicit-dependencies'];

interface IBrowserRule {
  Rule: AbstractRule;
}

interface IBrowserRuleInfo {
  config: IOptions;
  kebabName: string;
  rule: Promise<IBrowserRule>;
  ruleName: string;
}

/**
 * Convert kebab-case to camelCase.
 * @param str string to convert
 */
const toCamelCase = (str: string) =>
  str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

/**
 * Dynamic import for a single rule, returns (a promise for) the imported rule
 * as well as rule metadata.
 * @param kebabName kebab-case-name for the rule
 * @param ruleSet the ruleset to pull the rule config from
 */
const getRule = (
  kebabName: string,
  ruleSet: Map<string, Partial<IOptions>>
): IBrowserRuleInfo => {
  const ruleName = toCamelCase(kebabName);
  return {
    config: ruleSet[kebabName],
    kebabName,
    rule: import(`tslint/lib/rules/${ruleName}Rule`),
    ruleName,
  };
};

/**
 * Get rule objects for rule set, and override them with custom rules object.
 * @param extendsString the rule set to extend (undefined, recommended etc)
 * @param rulesObject override for custom rules
 */
const getRules = async (
  extendsString: string | undefined,
  rulesObject: Map<string, Partial<IOptions>>
): Promise<AbstractRule[]> => {
  // Get the rule list
  const extendedRulesSet: Map<string, Partial<IOptions>> =
    extendsString !== undefined
      ? (await import(`tslint/lib/configs/${extendsString}`)).rules
      : {};

  // Combine with rule overrides to get the full set
  const ruleSet = { ...extendedRulesSet, ...rulesObject };

  // Filter to rules that work, and then construct rule objects
  const ruleObjects = Object.keys(ruleSet)
    .filter((kebabName) => EXCLUDED_RULES.indexOf(kebabName) === -1)
    .map((kebabName) => getRule(kebabName, ruleSet));

  // Run all the promises to pull in each rule
  const rules: IBrowserRule[] = await Promise.all(
    ruleObjects.map((rule) => rule.rule)
  );

  // Return rules
  return rules
    .filter((rulePromise) => rulePromise.Rule !== undefined)
    .map(({ Rule }, index) => {
      const ruleObject = ruleObjects[index];

      // @ts-ignore
      return new Rule({
        ruleName: ruleObject.kebabName,
        ruleSeverity: 'error',
        ...convertToNewConfig(ruleObject.config),
      });
    });
};

/**
 * Get the ruleset name from configuration file.
 * @param configuration configuration to get the rule from
 */
const getRuleSet = (configuration: IConfigurationFile) => {
  if (
    configuration === undefined ||
    configuration.extends === undefined ||
    configuration.extends.length === 0
  ) {
    return undefined;
  }
  const ruleset = configuration.extends[0].split('tslint:')[1];
  if (RULESETS.indexOf(ruleset) > -1) {
    return ruleset;
  }
  return undefined;
};

/**
 * Convert all config types to the new style of config
 * @param oldConfig the old configuration object
 */
const convertToNewConfig = (oldConfig: IOptions | any[] | boolean): object => {
  if (oldConfig instanceof Array) {
    return {
      ruleArguments: oldConfig.slice(1),
    };
  } else if (typeof oldConfig === 'boolean') {
    return {
      ruleArguments: [],
    };
  }
  return oldConfig;
};
