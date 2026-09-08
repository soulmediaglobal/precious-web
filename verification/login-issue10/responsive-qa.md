# Responsive QA — Issue #10

Browser: Firefox 153.0. Local URL: http://127.0.0.1:5190/admin-v2/login.

| Viewport | Document | Brand panel | Submit bottom | Screenshot |
| --- | --- | --- | --- | --- |
| desktop 1440×900 | 1440×900 | 720×900 | 622.5999755859375 | [desktop.png](desktop.png) |
| tablet 1024×768 | 1024×768 | 512×768 | 554.2000122070312 | [tablet.png](tablet.png) |
| mobile 390×844 | 390×844 | 390×260 | 676.4000244140625 | [mobile.png](mobile.png) |

Visual review: balanced 50:50 desktop/tablet split, visible existing logo, legible text over architectural photography, homepage yellow curve and CTA. Mobile stacks a compact brand header above the form. No horizontal overflow at the required viewports. Images loaded successfully.

Error state: [mobile-error.png](mobile-error.png). Required-field browser validation, server empty response, password visibility and keyboard focus were checked. See checks.json for exact outcomes.
