/*
  RATIONAL METHOD — typical runoff coefficients used by the educational
  calculator (tools/rational-method.html). These are the classic textbook
  ranges (ASCE, reproduced in FHWA HEC-22, Table 3-1). The calculator uses the
  midpoint as its default and shows the range. Local criteria always govern.
*/
const rationalCoefficients = [
  { group: "Pavement & roofs", items: [
    { id: "asphalt", label: "Asphalt pavement", min: 0.70, max: 0.95 },
    { id: "concrete", label: "Concrete pavement", min: 0.80, max: 0.95 },
    { id: "brick", label: "Brick pavement", min: 0.70, max: 0.85 },
    { id: "drives", label: "Drives and walks", min: 0.75, max: 0.85 },
    { id: "roofs", label: "Roofs", min: 0.75, max: 0.95 }
  ]},
  { group: "Lawns, sandy soil", items: [
    { id: "lawn-sand-flat", label: "Lawn, sandy soil, flat (≤2%)", min: 0.05, max: 0.10 },
    { id: "lawn-sand-avg", label: "Lawn, sandy soil, average (2–7%)", min: 0.10, max: 0.15 },
    { id: "lawn-sand-steep", label: "Lawn, sandy soil, steep (≥7%)", min: 0.15, max: 0.20 }
  ]},
  { group: "Lawns, heavy soil", items: [
    { id: "lawn-heavy-flat", label: "Lawn, heavy soil, flat (≤2%)", min: 0.13, max: 0.17 },
    { id: "lawn-heavy-avg", label: "Lawn, heavy soil, average (2–7%)", min: 0.18, max: 0.22 },
    { id: "lawn-heavy-steep", label: "Lawn, heavy soil, steep (≥7%)", min: 0.25, max: 0.35 }
  ]},
  { group: "Land use (whole-area)", items: [
    { id: "business-downtown", label: "Business, downtown", min: 0.70, max: 0.95 },
    { id: "business-neighborhood", label: "Business, neighborhood", min: 0.50, max: 0.70 },
    { id: "res-single", label: "Residential, single-family", min: 0.30, max: 0.50 },
    { id: "res-suburban", label: "Residential, suburban", min: 0.25, max: 0.40 },
    { id: "res-multi-detached", label: "Residential, multi-unit detached", min: 0.40, max: 0.60 },
    { id: "res-multi-attached", label: "Residential, multi-unit attached", min: 0.60, max: 0.75 },
    { id: "apartments", label: "Apartment dwelling areas", min: 0.50, max: 0.70 },
    { id: "industrial-light", label: "Industrial, light", min: 0.50, max: 0.80 },
    { id: "industrial-heavy", label: "Industrial, heavy", min: 0.60, max: 0.90 },
    { id: "parks", label: "Parks and cemeteries", min: 0.10, max: 0.25 },
    { id: "playgrounds", label: "Playgrounds", min: 0.20, max: 0.35 },
    { id: "railroad", label: "Railroad yards", min: 0.20, max: 0.40 },
    { id: "unimproved", label: "Unimproved areas", min: 0.10, max: 0.30 }
  ]}
];
