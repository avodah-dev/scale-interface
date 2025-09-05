# Project Management

**Purpose**: Central hub for all project documentation, planning, and resources for the 13-station scale interface system

## Quick Navigation

| Need | Location | Description |
|------|----------|-------------|
| Hardware specs & tools | `hardware/` | Complete hardware documentation and inventory |
| Client requirements | `client-notes/` | Site visit notes and validation results |
| UI mockups | `mockups/` | HTML prototypes for station and dashboard interfaces |
| Research & testing | `pre-contract-research/` | Mock scale testing and Sterling 7600 validation |
| Project proposals | `proposals/` | Deliverables, drafts, and specifications |
| Architecture decisions | `docs/` | System design and technical documentation |

## Folder Structure

### `client-notes/` - Client Communication & Requirements
- Site visit documentation
- Meeting notes and decisions
- Validation results from Sterling 7600 testing

### `docs/` - Technical Documentation
- System architecture decisions
- API specifications
- Integration patterns

### `hardware/` - Hardware Documentation
- Detailed specs for all equipment
- Procurement recommendations
- Compatibility matrices
- See: `hardware/_hardware-info.md` for complete index

### `mockups/` - UI Prototypes
- `station-interface.html` - Employee touchscreen interface
- `dashboard.html` - Supervisor monitoring dashboard
- `admin-panel.html` - System administration interface

### `pre-contract-research/` - Research & Validation
- Mock scale testing results (Phase 1a)
- Sterling 7600 protocol validation (Phase 2)
- Performance benchmarks

### `proposals/` - Project Proposals & Specs
- `deliverables/` - Client deliverables
- `drafts/` - Proposal iterations
- `specs/` - Technical specifications

## Key Resources

**Phase 1b Results**: Successful hardware validation with FTDI adapter
**Client Site Visit**: 2025-08-19 Sterling 7600 validation complete
**Current Phase**: Preparing client proposal based on validated requirements

## Cross-References

- **Implementation**: See `../src/` for TypeScript codebase
- **Work tracking**: See `../mission-tracker/` for current tasks
- **Coordination patterns**: See `../agent-coordination/` for AI collaboration