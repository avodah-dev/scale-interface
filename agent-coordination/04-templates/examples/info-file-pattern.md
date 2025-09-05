# Info File Pattern - Examples

## Basic Pattern

### src/components/_components-info.md
```markdown
# Components - Quick Reference

**Purpose**: UI components for the application interface

**Type Mapping**: `types/component-types.ts`, `types/props.ts`

## Which File Do I Need?

| If you need to... | Use this file | Why |
|-------------------|---------------|-----|
| Display user data | `UserCard.tsx` | User information display |
| Handle form input | `FormInput.tsx` | Validated input component |
| Show data tables | `DataTable.tsx` | Sortable, filterable tables |
| Layout pages | `Layout.tsx` | Page structure wrapper |

## File Breakdown

### `UserCard.tsx` - User Display
- **Role**: Shows user avatar, name, and stats
- **Key Props**: `user`, `showStats`, `onClick`
- **Used by**: Dashboard, ProfilePage

### `FormInput.tsx` - Input Handling
- **Role**: Reusable form input with validation
- **Key Props**: `value`, `onChange`, `validation`
- **Validation**: See validators.ts:23-45

### `DataTable.tsx` - Data Display
- **Role**: Flexible table with sorting/filtering
- **Props**: `data`, `columns`, `onSort`
- **Example**: See Dashboard.tsx:67-89

## Integration Points

- **State Management**: Uses store at store.ts:12
- **API Calls**: Through services/api.ts
- **Styling**: Uses styles/components.css
- **Types**: Imports from types/component-types.ts

## Common Issues

**"Component not rendering"**: Check props match types
**"Style not applied"**: Verify className matches CSS
**"State not updating"**: Ensure using proper hooks
```

## Advanced Pattern (with Business Context)

### src/calculations/_calculations-info.md
```markdown
# Calculations - Quick Reference

**Purpose**: Financial calculation engines for tax and interest

**Type Mapping**: `types/calculations.ts`, `types/financial.ts`

## Business Context

**Why These Matter**: Tax calculations must comply with local regulations and handle multiple jurisdictions. Interest compounds monthly with special rules for leap years.

**User Decisions**: Users set tax rates, choose calculation methods, and define compounding periods.

## Which File Do I Need?

| If you need to... | Use this file | Why |
|-------------------|---------------|-----|
| Calculate base tax | `tax-calculator.ts` | Standard tax computation |
| Apply deductions | `deduction-engine.ts` | Deduction rules and limits |
| Compute interest | `interest-calculator.ts` | Compound interest logic |
| Handle payments | `payment-processor.ts` | Payment scheduling |

## File Breakdown

### `tax-calculator.ts` - Tax Computation ⭐ Most Important
- **Role**: Calculate tax based on rates and brackets
- **Entry Point**: `calculateTax()` at line 45
- **Configuration**: Uses config from tax-config.ts:12-34
- **Validation**: See validateTaxInput() at line 23

### `interest-calculator.ts` - Interest Engine
- **Role**: Compound interest with special rules
- **Key Method**: `calculateCompoundInterest()` at line 67
- **Leap Year**: Special handling at line 89-95
- **Tests**: See interest.test.ts for examples

## Critical Business Rules

**Tax Brackets**: Progressive rates at tax-config.ts:45-67
**Interest Accrual**: Daily accrual, monthly compound
**Payment Priority**: Interest first, then principal
**Regulatory**: Must comply with Reg-Z (see docs/compliance.md)

## Integration Points

- **Data Source**: Reads from database/tax-tables
- **API**: Exposed through api/calculations
- **UI**: Used by components/TaxCalculator.tsx
- **Reports**: Feeds into reporting/tax-summary

## Common Issues & Solutions

**"Wrong tax amount"**: Check bracket configuration
**"Interest mismatch"**: Verify compound period
**"Payment not applied"**: Check payment priority rules
```

## Minimal Pattern (for small modules)

### src/utils/_utils-info.md
```markdown
# Utils - Quick Reference

**Purpose**: Utility functions for common operations

## Main Utilities

- `formatters.ts` - Date, currency, number formatting
- `validators.ts` - Input validation functions  
- `helpers.ts` - Misc helper functions
- `constants.ts` - App-wide constants

## Most Used

**Format date**: See formatDate() at formatters.ts:12
**Validate email**: See isEmail() at validators.ts:34
**Generate ID**: See generateId() at helpers.ts:56
```

## Pattern Guidelines

### Required Elements
1. **Purpose statement** - One line
2. **Which File Do I Need?** - Decision helper
3. **File Breakdown** - Key files with roles

### Optional Elements
- **Type Mapping** - Related type files
- **Business Context** - Why it matters
- **Integration Points** - How it connects
- **Common Issues** - Troubleshooting

### Keep It Under 100 Lines
- Focus on navigation, not explanation
- Use references: "See file.ts:45"
- Split if getting too long
- Link to detailed docs if needed

### Update Triggers
- New files added to folder
- Major refactoring
- Changed responsibilities
- New integration points

## Creating Your First Info Files

1. **Start with high-traffic folders** (components, services, core logic)
2. **Use the minimal pattern** initially
3. **Add sections as needed** based on questions you get
4. **Keep it navigation-focused** - where, not how
5. **Update when structure changes** significantly