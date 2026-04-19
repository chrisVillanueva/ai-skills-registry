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

The book_source/ directory holds reference material used 
during skill creation. It is not part of the skill registry itself.
Each book is meant to be private.  It's intentional because primary
information consists of general case studies, generic UML 
sequence and component diagrams, flow charts, and notes 
accumulated over 20+ years of
technical consulting experience.  

For example, a general case 
study within a chapter has content similar to:

``` quote

Case Study Example:

Firm A's token redesign has been in production for a year. 
When the company signs its largest enterprise deal with a 
global logistics corporation, the token redesign strategy 
recieves high-level visibility within the firm.   The new
deal requires a 99.99% uptime SLA with financial penalties
for breaches. 

During a postmortem for an unrelated EU networking z
incident, Firm A's SRE Director realizes the architecture 
still has a subtle single point of failure: the async 
pub/sub system that propagates revocation events. When 
it stalled for 90 seconds during the incident, two 
regions were serving requests against stale revocation 
caches with no way to know they were stale. 

The central auth service is also a logical single 
authority.  If it's unreachable, new tokens will not be 
issued. 

New SRE Key Requirements: 
Every region must be able to issue, validate, 
and revoke tokens independently during a network 
partition.  Revocation state must converge 
deterministically when connectivity resumes and the 
system must avoid split-brain scenarios where 
a revoked session is valid in one region and 
invalid in another post-merge.  The solution 
cannot require cross-region synchronous calls 
on the request path. 

Which architectural approach should Firm A use to 
meet contractual SLA requirements for their new
corporate client?

```

``` mermaid

---
title: "Variation 2: CRDT-based distributed session state"
---
flowchart TB
    subgraph US_East["US-East"]
        GW_US["Gateway"]
        CRDT_US["Session CRDT\nG-Counter + LWW"]
        Auth_US["Auth service\nRegional primary"]
        GW_US --> CRDT_US
        CRDT_US --> Auth_US
    end

    subgraph EU_West["EU-West"]
        GW_EU["Gateway"]
        CRDT_EU["Session CRDT\nG-Counter + LWW"]
        Auth_EU["Auth service\nRegional primary"]
        GW_EU --> CRDT_EU
        CRDT_EU --> Auth_EU
    end

    subgraph AP_South["AP-South"]
        GW_AP["Gateway"]
        CRDT_AP["Session CRDT\nG-Counter + LWW"]
        Auth_AP["Auth service\nRegional primary"]
        GW_AP --> CRDT_AP
        CRDT_AP --> Auth_AP
    end

    CRDT_US <-->|"Peer-to-peer\nsync"| CRDT_EU
    CRDT_EU <-->|"Peer-to-peer\nsync"| CRDT_AP
    CRDT_US <-.->|"Peer-to-peer\nsync"| CRDT_AP

    style GW_US fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style GW_EU fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style GW_AP fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style CRDT_US fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style CRDT_EU fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style CRDT_AP fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style Auth_US fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style Auth_EU fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style Auth_AP fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    
```

      
Skills are standalone.  They capture distilled expert 
knowledge without referencing their primary source material.


## Skill Creation Workflow

1. Read the source chapter thoroughly
2. Extract all expert technical recommendations
3. Identify technical judgments for nuanced situations
4. Distill subtle recommendations for ambiguous scenarios
5. Create Mermaid UML diagrams for critical concepts and relationships
6. Iterate and refine with reviewers
7. Write the final SKILL.md using `TEMPLATE.md` as a starting point
