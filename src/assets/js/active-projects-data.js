/*
  PLAIN PROJECT CARDS on Life & Interests: projects that don't have their own
  project page (yet). Same card look as the others, but no page and no quick view.
  group: the Life & Interests group id the card joins ("apps" or "projects").
  status: shown above the title. cover: image under src/ (optional).
  href: ONLY for public, live pages. Leave it out for private work.
*/

const activeProjects = {
  items: [
    {
      id: "parcel-filter",
      group: "apps",
      type: "Web Application",
      title: "Parcel Filter",
      status: "In development",
      cover: "images/personal/covers/parcel-filter.svg",
      text: "A map tool that sorts Northwest Florida parcels by acreage, vacancy, zoning, flood zone, and utilities, using live public county data."
    },
    {
      id: "tree-survey",
      group: "apps",
      type: "Mobile Web App",
      title: "Tree Survey App",
      status: "In development",
      cover: "images/personal/covers/tree-survey.svg",
      text: "An offline phone app that logs trees with averaged GPS and exports Civil 3D points, paired with a tree protection and mitigation calculator."
    },
    {
      id: "products",
      group: "projects",
      type: "Digital Products",
      title: "Digital products",
      status: "Live on Gumroad",
      cover: "images/personal/covers/digital-products.svg",
      text: "Study guides and spreadsheet tools from civil work: PE exam prep, estimating and land development, and real estate investing analyzers.",
      href: "/civil.html#products-title",
      hrefLabel: "See the products"
    },
    {
      id: "stem-books",
      group: "projects",
      type: "Children’s Books",
      title: "STEM picture book series",
      status: "Book 1 in progress",
      cover: "images/personal/covers/stem-books.svg",
      text: "Read-aloud picture books for ages 4–7 about how bridges, roads, and stormwater work, by Zachery A. Taylor and published by ZT, LLC."
    }
  ]
};
