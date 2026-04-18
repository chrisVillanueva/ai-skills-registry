# AI Skills Registry

A skills registry for AI-assisted work, following the [Agent Skills open standard](https://agentskills.io).

Skills capture expert procedural knowledge -- distilled technical recommendations, decision frameworks, and subtle judgments -- so that AI agents can apply domain expertise reliably.

## Directory Structure

```
skills-builder/
├── README.md                            # this file
├── TEMPLATE.md                          # canonical SKILL.md template
├── foundations/                          # spec documentation and diagrams
├── book_source/                         # source material (not deployed as skills)
│   └── <author>/
│       └── <Author>-<NN>-<Title>.pdf
├── data-engineering/                    # domain
│   └── <skill-name>/
│       ├── SKILL.md                     # required
│       ├── scripts/                     # optional (Tier 3)
│       ├── references/                  # optional (Tier 3)
│       └── assets/                      # optional (Tier 3)
├── ai-engineering/                      # domain
└── <future-domain>/
```

## Conventions

### Skills

- Every skill directory MUST contain a `SKILL.md`
- The `name` frontmatter field MUST match the directory name exactly
- The `description` field should follow the `[WHAT] / [WHEN] / [KEYWORDS]` pattern
- Body content should stay under 5,000 tokens (Tier 2 recommendation)
- Tier 3 subdirectories (`scripts/`, `references/`, `assets/`) are created only when needed -- do not commit empty ones
- Skills SHOULD include Mermaid UML diagrams to explain critical concepts, relationships, and data flows -- these serve as visual reference material within the skill body

### Naming

| Element | Rule | Example |
|---------|------|---------|
| Skill name/dir | lowercase, hyphens, max 64 chars, no `--` | `oltp-vs-olap` |
| Domain dirs | lowercase with hyphens, broad disciplines | `data-engineering` |

### Progressive Disclosure

| Tier | Content | Token Budget | When Loaded |
|------|---------|-------------|-------------|
| 1 -- metadata | `name` + `description` | ~100 tokens | Always (startup) |
| 2 -- instructions | Full SKILL.md body | < 5,000 tokens | On skill activation |
| 3 -- resources | `scripts/`, `references/`, `assets/` | Unlimited | On demand |

The `description` is the activation gate -- it determines whether an agent triggers the skill. It must explain what the skill does, when to trigger it, and include specific trigger keywords.

### Source Material

The `book_source/` directory holds reference material used during skill creation. It is not part of the skill registry itself. Skills are standalone -- they capture distilled expert knowledge without referencing their source material.

## Skill Creation Workflow

1. Read the source chapter thoroughly
2. Extract all expert technical recommendations
3. Identify technical judgments for nuanced situations
4. Distill subtle recommendations for ambiguous scenarios
5. Create Mermaid UML diagrams for critical concepts and relationships
6. Iterate and refine with reviewers
7. Write the final SKILL.md using `TEMPLATE.md` as a starting point
