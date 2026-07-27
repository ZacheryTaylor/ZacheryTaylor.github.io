const projects = [
  {
    id: "surfboard",
    type: "Materials",
    date: "Mechanical Engineering\n2025–2026",
    title: "Electric Jet-Driven Surfboard",
    cardDescription:
      "A mechanical engineering concept for an electric jet-driven surfboard with a modular propulsion unit.",
    coverImage: "images/academic/ElectricJetDrivenSurfboard.png",
    coverAlt: "Electric jet-driven surfboard project preview",
    description:
      "A conceptual electric surfboard design centered on a modular jet-drive propulsion unit and the integration of its major mechanical systems.",
    summary: [
      {
        heading: "Focus",
        text:
          "Electric propulsion, jet-drive integration, modularity, and personal-watercraft design."
      },
      {
        heading: "Deliverable",
        text:
          "A documented design concept and engineering analysis report."
      }
    ],
    pdf: "pdfs/academic/ElectricJetDrivenSurfboard.pdf",
    gallery: [
      {
        src: "images/academic/surfboard-gallery/surfboard-01.png",
        alt: "Electric jet-driven surfboard concept render",
        caption: "Electric jet-driven surfboard concept render."
      },
      {
        src: "images/academic/surfboard-gallery/surfboard-02.png",
        alt: "Surfboard structure and internal system layout",
        caption: "Surfboard structure and internal system layout."
      },
      {
        src: "images/academic/surfboard-gallery/surfboard-03.png",
        alt: "Modular propulsion-unit development",
        caption: "Modular propulsion-unit development."
      },
      {
        src: "images/academic/surfboard-gallery/surfboard-04.png",
        alt: "Mechanical design detail",
        caption: "Mechanical design detail."
      },
      {
        src: "images/academic/surfboard-gallery/surfboard-05.png",
        alt: "Concept visualization and component integration",
        caption: "Concept visualization and component integration."
      },
      {
        src: "images/academic/surfboard-gallery/surfboard-06.png",
        alt: "Surfboard design iteration",
        caption: "Surfboard design iteration."
      },
      {
        src: "images/academic/surfboard-gallery/surfboard-07.png",
        alt: "Final surfboard design render",
        caption: "Final surfboard design render."
      }
    ]
  },

  {
    id: "baja",
    type: "SAE Baja",
    date: "Mechanical Engineering\n2025–2026",
    title: "UWF Argo Racing SAE Baja",
    cardDescription:
      "Treasurer, driver, and team member supporting fundraising, operations, competition preparation, and Baja SAE competition.",
    coverImage: "images/academic/UWFBaja.jpg",
    coverAlt: "UWF Argo Racing SAE Baja team and vehicle",
    description:
      "UWF Argo Racing is a student Baja SAE team that designs, builds, tests, and competes with a single-seat off-road vehicle.",
    summary: [
      {
        heading: "Leadership",
        text:
          "Served as Treasurer, created budgets, developed fundraising plans, led presentations, and coordinated sponsor outreach."
      },
      {
        heading: "Competition",
        text:
          "Selected as a driver and participated in Baja SAE competition, including static and dynamic event preparation."
      },
      {
        heading: "Fundraising",
        text:
          "Secured more than $27,000 in sponsorships from local and national companies to bring UWF to the competition stage."
      },
      {
        heading: "Team Operations",
        text:
          "Built sponsorship materials, scoring resources, sub-team punchlists, budgets, and marketing items for Argo Racing."
      }
    ],
    gallery: [
      {
        src: "images/academic/baja-gallery/baja-03.JPG",
        alt: "UWF Argo Racing team at technical inspection",
        caption: "Technical inspection."
      },
      {
        src: "images/academic/baja-gallery/baja-04.JPG",
        alt: "UWF Argo Racing driver in safety gear awaiting inspection",
        caption: "In driver gear while awaiting inspection."
      },
      {
        src: "images/academic/baja-gallery/baja-05.jpg",
        alt: "UWF Argo Racing team photo",
        caption: "UWF Argo Racing team photo."
      },
      {
        src: "images/academic/baja-gallery/baja-06.jpg",
        alt: "UWF Argo Racing driver in safety gear",
        caption: "In driver gear while awaiting inspection."
      },
      {
        src: "images/academic/baja-gallery/baja-07.jpg",
        alt: "UWF Argo Racing vehicle maintenance",
        caption: "Vehicle maintenance on day two."
      },
      {
        src: "images/academic/baja-gallery/baja-08.JPG",
        alt: "UWF Argo Racing trailer at competition",
        caption: "UWF trailer at competition."
      },
      {
        src: "images/academic/baja-gallery/baja-09.jpg",
        alt: "UWF Argo Racing vehicle progress",
        caption: "Vehicle progress on day two."
      },
      {
        src: "images/academic/baja-gallery/baja-10.JPEG",
        alt: "UWF Argo Racing driver in safety gear awaiting inspection",
        caption: "In driver gear while awaiting inspection."
      },
      {
        src: "images/academic/baja-gallery/baja-11.jpg",
        alt: "UWF Argo Racing driver in safety gear",
        caption: "In driver gear while awaiting inspection."
      },
      {
        src: "images/academic/baja-gallery/baja-12.jpg",
        alt: "UWF Argo Racing driver in full safety gear",
        caption: "Full driver gear."
      },
      {
        src: "images/academic/baja-gallery/baja-13.JPG",
        alt: "UWF Argo Racing egress test",
        caption: "Egress testing for technical inspection."
      },
      {
        src: "images/academic/baja-gallery/baja-14.JPG",
        alt: "Florida teams at SAE Baja New York 2026",
        caption: "Florida teams at SAE Baja, New York 2026."
      },
      {
        src: "images/academic/baja-gallery/bajainterest-01.png",
        alt: "UWF Argo Racing interest flyer",
        caption: "Team recruitment and interest material."
      },
      {
        src: "images/academic/baja-gallery/bajainterest-02.png",
        alt: "UWF Argo Racing outreach flyer",
        caption: "Team outreach material."
      }
    ]
  },

    {
    id: "precision-horticulture",
    type: "Mechatronics",
    date: "Mechanical Engineering\n2025",
    title: "Precision Horticulture Planter",
    cardDescription:
      "An Arduino-based automated planter that monitors soil moisture and delivers controlled irrigation to two independent plant zones.",
    coverImage: "images/academic/PrecisionHorticulture.jpg",
    coverAlt:
      "Arduino-based precision horticulture planter with automated irrigation components",
    description:
      "A mechatronics project focused on designing and building an affordable automated planter system for precision horticulture. The system uses an Arduino microcontroller, soil-moisture sensors, relay-controlled water pumps, and a sensor-activated manual dispensing station to monitor and regulate irrigation across two plant zones.",
    summary: [
      {
        heading: "System Design",
        text:
          "Built an Arduino-controlled planter with two independent growing zones, each using an LM393 soil-moisture sensor, a 5V water pump, and a relay module for targeted irrigation."
      },
      {
        heading: "Control Logic",
        text:
          "Programmed real-time analog moisture monitoring and automatic pump activation when readings exceeded the selected dry-soil threshold, helping prevent overwatering and underwatering."
      },
      {
        heading: "Watering Can Refill",
        text:
          "Added a proximity-activated water dispenser using an infrared sensor, allowing supplemental manual watering through a side hose when a hand or object is detected."
      },
      {
        heading: "Safety and Expansion",
        text:
          "Included individual rocker switches to disable each irrigation zone or the dispensing station during maintenance. Planned future improvements include low-power sleep cycles and expanded environmental monitoring."
      }
    ],
    pdf: "pdfs/academic/PrecisionHorticulture.pdf",
    gallery: [
      {
        src: "images/academic/precisionhorticulture-gallery/PrecisionHorticulture.jpg",
        alt: "Completed precision horticulture automated planter system",
        caption: "Completed Arduino-based precision horticulture planter system."
      },
      {
        src: "images/academic/precisionhorticulture-gallery/ph-01.jpg",
        alt: "Precision horticulture planter components and wiring",
        caption: "Automated planter components and electrical wiring."
      },
      {
        src: "images/academic/precisionhorticulture-gallery/ph-02.jpg",
        alt: "Soil moisture sensors and water-pump irrigation setup",
        caption: "Soil-moisture sensors and dedicated irrigation pumps."
      },
      {
        src: "images/academic/precisionhorticulture-gallery/ph-03.jpg",
        alt: "Arduino control system for automated planter",
        caption: "Arduino control system and relay-based pump connections."
      },
      {
        src: "images/academic/precisionhorticulture-gallery/ph-04.jpg",
        alt: "Precision horticulture automated planter prototype",
        caption: "Automated planter prototype during system testing."
      }
    ]
  },


    {
    id: "automated-car-elevator",
    type: "Mechatronics",
    date: "Mechanical Engineering\n2025",
    title: "Automated Car and Elevator System",
    cardDescription:
      "An Arduino-controlled elevator and autonomous vehicle system designed to lower an RC car and navigate a hallway while avoiding walls.",
    coverImage: "images/academic/CarAndElevator.jpg",
    coverAlt:
      "Arduino-based automated car and elevator system with wall-avoidance sensors",
    description:
      "A mechatronics project involving the design and construction of an automated elevator and wall-avoiding vehicle system. An infrared sensor detected when an RC car entered the elevator, triggering a stepper-motor sequence that lowered the platform; after the RC car exited, a limit switch activated an autonomous vehicle that navigated a hallway using ultrasonic wall detection.",
    summary: [
      {
        heading: "System Sequence",
        text:
          "Designed a coordinated sequence in which an IR sensor detected the RC car, a stepper-motor elevator lowered it from 10 inches to 1 inch above the ground, and its exit triggered the next stage."
      },
      {
        heading: "Vehicle Design",
        text:
          "Built the autonomous vehicle from a lightweight cardboard chassis with two front DC drive motors, a ping-pong-ball rear support, an Arduino controller, an L298N motor driver, battery holders, and sensors."
      },
      {
        heading: "Autonomous Control",
        text:
          "Used a rear limit switch to start autonomous driving and two ultrasonic sensors to measure wall distance. The control logic moved the vehicle forward and made corrective turns when an obstacle was within 20 cm."
      },
      {
        heading: "Result",
        text:
          "Produced a functional integrated system that met the project constraints for automated elevator movement, vehicle release, and wall-avoiding hallway navigation."
      }
    ],
    pdf: "pdfs/academic/CarAndElevator.pdf",
    gallery: [
      {
        src: "images/academic/CarAndElevator-gallery/CarAndElevator.jpg",
        alt: "Completed automated car and elevator system",
        caption: "Completed automated elevator and wall-avoiding vehicle system."
      },
      {
        src: "images/academic/CarAndElevator-gallery/CnE-01.jpg",
        alt: "Automated car and elevator system during testing",
        caption: "Automated car and elevator system during testing."
      }
    ]
  },
  
  {
    id: "cfd-wind-tunnel",
    type: "CFD",
    date: "Mechanical Engineering\n2024",
    title: "Subsonic Wind Tunnel Optimization",
    cardDescription:
      "ANSYS Fluent CFD modeling to improve wind-tunnel flow quality and reduce recirculation after the test section.",
    coverImage: "images/academic/CFDGroup/CFDGroup-01.png",
    coverAlt: "CFD model of subsonic wind tunnel geometry",
    description:
      "A Computational Fluid Dynamics project focused on improving a homemade, open-system subsonic wind tunnel for small-scale aerodynamic testing. I led the ANSYS Fluent modeling and diffuser-optimization work, evaluating geometry changes that could reduce recirculation and improve test-section flow quality.",
    summary: [
      {
        heading: "My Role",
        text:
          "Led diffuser analysis in ANSYS Fluent, created the base and modified geometries, completed mesh-independence verification, and produced velocity-vector and pathline visualizations."
      },
      {
        heading: "Method",
        text:
          "Compared 46 × 46 mm, 40 × 40 mm, and 36 × 36 mm diffuser outlets using turbulent-flow simulations, mesh analysis, residual monitoring, and velocity-based flow visualization."
      },
      {
        heading: "Key Result",
        text:
          "Reducing the diffuser angle from 12.95 degrees to 10.20 degrees substantially reduced the recirculation zone downstream of the test section."
      },
      {
        heading: "Deliverable",
        text:
          "A formal CFD report documenting geometry development, simulation settings, mesh verification, flow results, and recommended design improvements."
      }
    ],
    pdf: "pdfs/academic/CFDGroup.pdf",
    gallery: [
      {
        src: "images/academic/CFDGroup/CFDGroup-02.png",
        alt: "Velocity-magnitude pathlines for 46 by 46 millimeter diffuser outlet",
        caption: "Velocity-magnitude pathlines: 46 × 46 mm diffuser outlet."
      },
      {
        src: "images/academic/CFDGroup/CFDGroup-01.png",
        alt: "Velocity-magnitude pathlines for 40 by 40 millimeter diffuser outlet",
        caption: "Velocity-magnitude pathlines: 40 × 40 mm diffuser outlet."
      },
      {
        src: "images/academic/CFDGroup/CFDGroup-03.png",
        alt: "Velocity-magnitude pathlines for 36 by 36 millimeter diffuser outlet",
        caption: "Velocity-magnitude pathlines: 36 × 36 mm diffuser outlet."
      },
      {
        src: "images/academic/CFDGroup/CFDGroup-04.png",
        alt: "Velocity-magnitude vectors for 46 by 46 millimeter diffuser outlet",
        caption: "Velocity-magnitude vectors: 46 × 46 mm diffuser outlet."
      },
      {
        src: "images/academic/CFDGroup/CFDGroup-05.png",
        alt: "Velocity-magnitude vectors for 40 by 40 millimeter diffuser outlet",
        caption: "Velocity-magnitude vectors: 40 × 40 mm diffuser outlet."
      },
      {
        src: "images/academic/CFDGroup/CFDGroup-06.png",
        alt: "Velocity-magnitude vectors for 36 by 36 millimeter diffuser outlet",
        caption: "Velocity-magnitude vectors: 36 × 36 mm diffuser outlet."
      }
    ]
  },

  {
    id: "ahmed-car-model",
    type: "CFD",
    date: "Mechanical Engineering\n2024",
    title: "Ahmed Car Aerodynamic CFD Model",
    cardDescription:
      "ANSYS Fluent analysis of airflow around an Ahmed car model, including mesh-independence testing, aerodynamic forces, and flow visualization.",
    coverImage: "images/academic/AhmedCar.jpg",
    coverAlt: "Ahmed car model computational fluid dynamics analysis",
    description:
      "A Computational Fluid Dynamics study of external airflow around an Ahmed car model using ANSYS Fluent. The project evaluated aerodynamic behavior at a 40 m/s inlet velocity through mesh refinement, solution convergence, velocity-profile comparisons, drag and lift monitoring, and flow-field visualization.",
    summary: [
      {
        heading: "Simulation Setup",
        text:
          "Modeled external airflow around an Ahmed car geometry using a 40 m/s inlet velocity, 5% turbulence intensity, and a standard k-epsilon turbulence model."
      },
      {
        heading: "Mesh Study",
        text:
          "Compared 0.016 m and 0.008 m mesh sizes containing approximately 202,907 and 436,355 cells, respectively, to evaluate mesh independence."
      },
      {
        heading: "Analysis",
        text:
          "Monitored convergence residuals, drag and lift forces, and X-velocity profiles at multiple locations around and downstream of the vehicle."
      },
      {
        heading: "Results",
        text:
          "Evaluated velocity-magnitude and static-pressure contours, pathlines, vectors, aerodynamic drag and lift, and experimental-data comparisons to assess wake behavior and flow around the vehicle."
      }
    ],
    pdf: "pdfs/academic/AhmedCarModel.pdf"
  },

  {
    id: "laminar-turbulent-pipe-flow",
    type: "CFD",
    date: "Mechanical Engineering\n2024",
    title: "Laminar and Turbulent Pipe Flow",
    cardDescription:
      "ANSYS Fluent CFD analysis comparing fully developed laminar and turbulent airflow through a smooth circular pipe.",
    coverImage: "images/academic/LaminarAndTurbulent.jpg",
    coverAlt:
      "ANSYS Fluent laminar and turbulent airflow analysis in a smooth pipe",
    description:
      "A Computational Fluid Dynamics study of air flowing through a 2 m-long, 0.04 m-diameter smooth pipe. The project compared laminar and turbulent flow behavior in ANSYS Fluent, evaluated solution convergence and mesh independence, and examined how the velocity profile developed along the pipe.",
    summary: [
      {
        heading: "Simulation Setup",
        text:
          "Modeled airflow through a smooth cylindrical pipe using a 0.02 m/s laminar inlet case and a 2 m/s turbulent inlet case. The turbulent simulation used a k-epsilon model with 5% turbulence intensity."
      },
      {
        heading: "Mesh Study",
        text:
          "Compared 0.003 m and 0.005 m body-sizing meshes containing approximately 469,484 and 114,929 cells to evaluate outlet velocity-profile sensitivity to mesh density."
      },
      {
        heading: "Convergence",
        text:
          "Tracked residuals and compared velocity profiles at intermediate and later iterations, showing that additional iterations produced no significant change after the solutions stabilized."
      },
      {
        heading: "Key Results",
        text:
          "The laminar centerline velocity became essentially fully developed after approximately 0.2 m, while the turbulent case stabilized after approximately 1 m. Laminar results closely matched the provided analytical velocity profile; the turbulent results provided a reasonable approximation."
      }
    ],
    pdf: "pdfs/academic/LaminarAndTurbulent.pdf"
  },

  {
    id: "water-flow-elbow",
    type: "CFD",
    date: "Mechanical Engineering\n2024",
    title: "Water Flow Through an Elbow",
    cardDescription:
      "ANSYS Fluent CFD comparison of water flow, temperature, pressure, and velocity through two multi-inlet elbow geometries.",
    coverImage: "images/academic/WaterFlowElbow.jpg",
    coverAlt:
      "ANSYS Fluent CFD model of water flow through a multi-inlet elbow",
    description:
      "A Computational Fluid Dynamics project comparing water flow through two elbow geometries with two velocity inlets and one pressure outlet. Using ANSYS Fluent, the study evaluated how increasing the smaller inlet diameter affected internal velocity, pressure, temperature distribution, and flow pathlines.",
    summary: [
      {
        heading: "Geometry Comparison",
        text:
          "Compared two multi-inlet elbow models with a 100 mm primary inlet and 100 mm outlet. The smaller inlet diameter increased from 25 mm in the original elbow to 38 mm in the revised geometry."
      },
      {
        heading: "Flow Conditions",
        text:
          "Modeled liquid water entering the 100 mm inlet at 0.4 m/s and 293.15 K, with a secondary inlet velocity of 1.2 m/s and a temperature of 313.15 K; both models used a pressure outlet."
      },
      {
        heading: "CFD Method",
        text:
          "Used the k-omega SST turbulence model with second-order discretization methods. The elbow and revised-elbow meshes contained approximately 119,161 and 117,156 cells, respectively."
      },
      {
        heading: "Analysis",
        text:
          "Evaluated solution residuals, outlet temperature profiles, velocity-magnitude contours, pressure fields, and pathlines to visualize mixing and flow behavior through both configurations."
      }
    ],
    pdf: "pdfs/academic/WaterFlowElbow.pdf",
    gallery: [
      {
        src: "images/academic/waterflowelbow-gallery/WaterFlowElbow-01.jpg",
        alt: "Original elbow geometry used for water-flow CFD analysis",
        caption: "Original elbow geometry with 100 mm primary inlet, 25 mm secondary inlet, and 100 mm outlet."
      },
      {
        src: "images/academic/waterflowelbow-gallery/WaterFlowElbow-02.jpg",
        alt: "Revised elbow geometry used for water-flow CFD analysis",
        caption: "Revised elbow geometry with the secondary inlet increased to 38 mm."
      },
      {
        src: "images/academic/waterflowelbow-gallery/WaterFlowElbow-03.jpg",
        alt: "ANSYS Fluent mesh for original water-flow elbow",
        caption: "Computational mesh for the original elbow configuration."
      },
      {
        src: "images/academic/waterflowelbow-gallery/WaterFlowElbow-04.jpg",
        alt: "ANSYS Fluent mesh for revised water-flow elbow",
        caption: "Computational mesh for the revised elbow configuration."
      },
      {
        src: "images/academic/waterflowelbow-gallery/WaterFlowElbow-05.jpg",
        alt: "Velocity-magnitude result for water flow through elbow",
        caption: "Velocity-magnitude result used to examine internal flow behavior."
      },
      {
        src: "images/academic/waterflowelbow-gallery/WaterFlowElbow-06.jpg",
        alt: "Pressure result for water flow through elbow",
        caption: "Pressure-field result for the elbow flow analysis."
      },
      {
        src: "images/academic/waterflowelbow-gallery/WaterFlowElbow-07.jpg",
        alt: "Water-flow pathlines through revised elbow",
        caption: "Velocity-magnitude pathlines showing water flow through the revised elbow."
      }
    ]
  },
  
  {
    id: "future-academic-project",
    type: "Coursework",
    date: "Engineering\n2025",
    title: "Project Title",
    cardDescription:
      "Future academic project, design effort, laboratory study, analysis, or technical presentation.",
    placeholder: true,
    description:
      "This entry will be replaced with a completed project summary describing the objective, technical process, role, deliverables, and key takeaways.",
    summary: []
  }
];
