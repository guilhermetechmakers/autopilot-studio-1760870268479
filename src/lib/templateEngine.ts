import type { TemplateVariable, ConditionalSection } from '@/types/proposal';

/**
 * Template Engine for processing proposal templates with variables and conditional sections
 */

interface TemplateContext {
  [key: string]: string | number | boolean | string[] | undefined;
}

/**
 * Replace template variables in content
 * Supports: {{variable}}, {{variable.nested}}, {{#each items}}...{{/each}}
 */
export function processTemplateVariables(
  template: string,
  context: TemplateContext
): string {
  let processed = template;

  // Process simple variables: {{variable}}
  processed = processed.replace(/\{\{([^{}#/]+)\}\}/g, (match, key) => {
    const trimmedKey = key.trim();
    const value = getNestedValue(context, trimmedKey);
    return value !== undefined ? String(value) : match;
  });

  // Process each loops: {{#each items}}...{{/each}}
  processed = processEachLoops(processed, context);

  return processed;
}

/**
 * Evaluate conditional sections based on context
 */
export function processConditionalSections(
  content: string,
  conditionalSections: ConditionalSection[],
  context: TemplateContext
): string {
  let processed = content;

  for (const section of conditionalSections) {
    const shouldInclude = evaluateCondition(section.condition, context);
    
    if (shouldInclude) {
      // Replace placeholder with section content
      const placeholder = `{{#if ${section.id}}}`;
      processed = processed.replace(placeholder, section.content);
    } else {
      // Remove placeholder
      const placeholder = `{{#if ${section.id}}}`;
      processed = processed.replace(placeholder, '');
    }
  }

  return processed;
}

/**
 * Validate template variables against context
 */
export function validateTemplateVariables(
  variables: TemplateVariable[],
  context: TemplateContext
): { valid: boolean; missing: string[]; errors: string[] } {
  const missing: string[] = [];
  const errors: string[] = [];

  for (const variable of variables) {
    const value = context[variable.key];

    // Check required variables
    if (variable.required && (value === undefined || value === null || value === '')) {
      missing.push(variable.label);
      continue;
    }

    // Type validation
    if (value !== undefined) {
      const typeValid = validateVariableType(value, variable.type);
      if (!typeValid) {
        errors.push(`${variable.label} must be of type ${variable.type}`);
      }
    }
  }

  return {
    valid: missing.length === 0 && errors.length === 0,
    missing,
    errors,
  };
}

/**
 * Extract variables from template content
 */
export function extractVariables(template: string): string[] {
  const variablePattern = /\{\{([^{}#/]+)\}\}/g;
  const variables = new Set<string>();
  let match;

  while ((match = variablePattern.exec(template)) !== null) {
    variables.add(match[1].trim());
  }

  return Array.from(variables);
}

/**
 * Generate preview with sample data
 */
export function generatePreview(
  template: string,
  variables: TemplateVariable[],
  conditionalSections: ConditionalSection[]
): string {
  // Create sample context
  const sampleContext: TemplateContext = {};
  
  for (const variable of variables) {
    sampleContext[variable.key] = variable.default_value || getSampleValue(variable.type);
  }

  // Process template
  let preview = processTemplateVariables(template, sampleContext);
  preview = processConditionalSections(preview, conditionalSections, sampleContext);

  return preview;
}

// Helper functions

function getNestedValue(obj: TemplateContext, path: string): unknown {
  const keys = path.split('.');
  let value: unknown = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return value;
}

function processEachLoops(template: string, context: TemplateContext): string {
  const eachPattern = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
  
  return template.replace(eachPattern, (_match, arrayKey, loopContent) => {
    const array = context[arrayKey];
    
    if (!Array.isArray(array)) {
      return '';
    }

    return array
      .map((item, index) => {
        let itemContent = loopContent;
        
        // Replace {{this}} with item value
        itemContent = itemContent.replace(/\{\{this\}\}/g, String(item));
        
        // Replace {{@index}} with index
        itemContent = itemContent.replace(/\{\{@index\}\}/g, String(index));
        
        // Replace {{item.property}} with nested properties
        if (typeof item === 'object' && item !== null) {
          itemContent = itemContent.replace(/\{\{item\.(\w+)\}\}/g, (_: string, prop: string) => {
            return String((item as Record<string, unknown>)[prop] || '');
          });
        }
        
        return itemContent;
      })
      .join('');
  });
}

function evaluateCondition(condition: string, context: TemplateContext): boolean {
  try {
    // Simple condition evaluation
    // Supports: variable, !variable, variable === value, variable !== value
    const trimmed = condition.trim();

    // Negation: !variable
    if (trimmed.startsWith('!')) {
      const key = trimmed.slice(1).trim();
      return !context[key];
    }

    // Equality: variable === value
    if (trimmed.includes('===')) {
      const [left, right] = trimmed.split('===').map(s => s.trim());
      const leftValue = context[left];
      const rightValue = right.replace(/['"]/g, '');
      return String(leftValue) === rightValue;
    }

    // Inequality: variable !== value
    if (trimmed.includes('!==')) {
      const [left, right] = trimmed.split('!==').map(s => s.trim());
      const leftValue = context[left];
      const rightValue = right.replace(/['"]/g, '');
      return String(leftValue) !== rightValue;
    }

    // Simple boolean check
    return !!context[trimmed];
  } catch {
    return false;
  }
}

function validateVariableType(
  value: unknown,
  type: TemplateVariable['type']
): boolean {
  switch (type) {
    case 'text':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && !isNaN(value);
    case 'date':
      return typeof value === 'string' && !isNaN(Date.parse(value));
    case 'list':
      return Array.isArray(value);
    case 'boolean':
      return typeof value === 'boolean';
    default:
      return true;
  }
}

function getSampleValue(type: TemplateVariable['type']): string | number | boolean | string[] {
  switch (type) {
    case 'text':
      return 'Sample Text';
    case 'number':
      return 1000;
    case 'date':
      return new Date().toISOString().split('T')[0];
    case 'list':
      return ['Item 1', 'Item 2', 'Item 3'];
    case 'boolean':
      return true;
    default:
      return 'Sample Value';
  }
}

/**
 * Format currency values
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format date values
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}
