const sample1 = {
  match_score: 94,
  technical_questions: [
    {
      question: "You have two unsorted arrays of integers, `arr1` and `arr2`. Write a function that returns a new array containing only the elements that are common to both `arr1` and `arr2`, without duplicates. Discuss the time and space complexity of your solution.",
      intention: "This question evaluates the candidate's understanding of Data Structures and Algorithms, specifically array manipulation, hash maps/sets, and efficiency analysis (time/space complexity). It assesses their problem-solving approach and ability to choose appropriate data structures for optimal performance.",
      how_to_answer: {
        points_to_cover: [
          "Identify edge cases (empty arrays, null values)",
          "Discuss different approaches: brute-force (nested loops), sorting and two-pointers, or using a hash set",
          "Explain the trade-offs in terms of time and space complexity for each approach",
          "The optimal solution will likely involve a hash set for efficient lookups"
        ],
        approach: "Start by explaining a naive approach (e.g., nested loops) and its complexity (O(N*M)). Then, propose an optimized solution using a hash set: add all elements from the first array to a hash set, then iterate through the second array, checking if each element exists in the hash set. If it does, add it to the result array and ensure no duplicates are added to the final result. Clearly state the improved time complexity (O(N+M)) and space complexity (O(N) or O(M))."
      }
    },
    {
      question: "You are building a REST API for a simple e-commerce product catalog. Design the API endpoints for managing products, including operations to: 1. Create a new product. 2. Retrieve a specific product by ID. 3. Update an existing product. 4. Delete a product. 5. List all products with optional filtering by category. For each endpoint, specify the HTTP method, the URL path, and a brief example of the request/response body.",
      intention: "This question assesses the candidate's understanding of RESTful API design principles, HTTP methods, status codes, and practical application of Node.js/Express.js concepts. It also evaluates their ability to design clear and functional API interfaces.",
      how_to_answer: {
        points_to_cover: [
          "Clearly define resource naming (e.g., `/products`)",
          "Map standard CRUD operations to appropriate HTTP methods (POST, GET, PUT/PATCH, DELETE)",
          "Show how to handle specific resources (e.g., `/products/:id`)",
          "Demonstrate how filtering/query parameters work for listing resources",
          "Provide example JSON request and response bodies, including appropriate HTTP status codes (200, 201, 204, 400, 404)"
        ],
        approach: "For each operation, specify: HTTP Method (e.g., `POST`), Path (e.g., `/api/products`), and then provide a sample JSON request body (for POST/PUT) and a sample JSON response body (for GET/POST/PUT). For listing all products, explain how query parameters like `/api/products?category=electronics` would work. Mention error handling briefly (e.g., returning 404 for not found)."
      }
    },
    {
      question: "In your 'Raksha' project, you used Appwrite for backend services. Can you explain how Appwrite abstracts common backend functionalities and what specific advantages or disadvantages you found compared to building a backend from scratch with Node.js/Express.js and MongoDB?",
      intention: "This question aims to understand the candidate's experience with BaaS (Backend-as-a-Service) solutions like Appwrite, their awareness of architectural trade-offs, and their ability to compare different backend approaches. It also probes into their practical project experience and critical thinking.",
      how_to_answer: {
        points_to_cover: [
          "Explain Appwrite's core features (authentication, databases, storage, functions, real-time)",
          "Discuss how it simplifies development by providing ready-to-use APIs",
          "Compare it with a custom Node.js/Express.js/MongoDB stack, focusing on aspects like development speed, flexibility, control, scalability, and vendor lock-in",
          "Mention specific benefits or limitations encountered in the Raksha project"
        ],
        approach: "Start by describing what Appwrite provided for Raksha (e.g., user management, data storage). Then, list the advantages (faster development, less boilerplate, managed services, built-in features). Follow with disadvantages (less control over specific logic, potential performance limitations, learning curve for Appwrite-specific APIs, vendor lock-in). Conclude by summarizing when one approach might be preferred over the other."
      }
    },
    {
      question: "You mentioned an interest in backend development and cloud technologies. From a backend perspective, how would you approach ensuring your Node.js application is robust and can handle increasing user traffic and data volume? What steps would you take to make it more scalable?",
      intention: "This question gauges the candidate's understanding of system design, scalability concepts, and best practices for building robust backend applications beyond basic CRUD operations. It explores their forward-thinking and awareness of production-level concerns.",
      how_to_answer: {
        points_to_cover: [
          "Discuss horizontal scaling (load balancing, running multiple instances)",
          "Mention database optimization strategies (indexing, sharding, replication)",
          "Explain caching mechanisms (Redis, Memcached)",
          "Talk about asynchronous processing/message queues (RabbitMQ, Kafka) for long-running tasks",
          "Discuss monitoring and logging",
          "Briefly touch upon microservices or serverless architectures as advanced scaling patterns"
        ],
        approach: "Start by breaking down the problem into different layers: application layer, database layer, and infrastructure. For each layer, propose specific strategies. For example, for the application layer, suggest load balancing and containerization (Docker). For the database, mention optimizing queries and considering replication. Emphasize that scalability is an ongoing process and involves continuous monitoring and optimization."
      }
    }
  ],
  behavioral_questions: [
    {
      question: "You mentioned participating in hackathons and enjoying working in teams. Can you describe a specific experience in a team project or hackathon where you faced a significant technical disagreement or conflict with a team member? How did you handle it, and what was the outcome?",
      intention: "This question aims to assess the candidate's teamwork, conflict resolution, communication, and collaboration skills, which are crucial for success in a professional software development environment.",
      how_to_answer: {
        points_to_cover: [
          "Use the STAR method (Situation, Task, Action, Result)",
          "Clearly describe the disagreement (Situation)",
          "Explain your role and the task at hand (Task)",
          "Detail the specific actions you took to address the conflict (Action), focusing on active listening, presenting your perspective constructively, finding common ground, or compromising",
          "Finally, describe the resolution and what you learned from the experience (Result)"
        ],
        approach: "Choose an actual event. Focus on demonstrating maturity and a constructive approach. Emphasize problem-solving over blame. Show you can respect other viewpoints and work towards a shared goal. The outcome should ideally be positive or, if not, offer a clear lesson learned."
      }
    },
    {
      question: "You mentioned solving 50+ problems on LeetCode and actively participating in coding contests. Tell me about a time you encountered a particularly difficult problem (either in competitive programming or a project) that you initially struggled to solve. Walk me through your thought process from encountering the problem to eventually finding a solution.",
      intention: "This question assesses the candidate's problem-solving methodology, persistence, debugging skills, and ability to learn and adapt when faced with complex technical challenges. It also probes into their self-motivation and intellectual curiosity.",
      how_to_answer: {
        points_to_cover: [
          "Use the STAR method",
          "Describe the problem clearly",
          "Explain your initial understanding and any initial incorrect approaches",
          "Detail the steps you took: breaking down the problem, researching (e.g., similar patterns, algorithms), debugging, testing different ideas",
          "Highlight any resources used (documentation, peers, online forums)",
          "Conclude with the solution found and the key lessons learned about problem-solving or a specific concept"
        ],
        approach: "Be specific about the technical details of the problem and your solutions. Show a structured approach to problem-solving. Emphasize resilience and the iterative nature of finding a solution. Don't be afraid to mention false starts or difficulties, as this demonstrates a realistic approach to complex problems."
      }
    },
    {
      question: "In your self-description, you candidly mentioned that you sometimes struggle with confidence while speaking in front of people but are actively working on improving your communication skills. Could you elaborate on this? What specific steps are you taking to address this challenge, and what progress have you observed?",
      intention: "This question directly addresses a self-identified area for growth. It aims to assess the candidate's self-awareness, proactivity in personal development, willingness to acknowledge weaknesses, and commitment to improving essential soft skills.",
      how_to_answer: {
        points_to_cover: [
          "Acknowledge the challenge honestly",
          "Provide specific examples of situations where this difficulty manifests",
          "Detail concrete actions you are taking (e.g., practicing presentations, joining Toastmasters/public speaking groups, volunteering to speak in class, preparing talking points more thoroughly)",
          "Discuss any positive progress or improvements you've noticed, even small ones, and your future goals for improvement"
        ],
        approach: "Be open and specific. Focus on the 'actively working on' aspect. Demonstrate initiative and a growth mindset. This question is an opportunity to turn a perceived weakness into a strength by showing commitment to self-improvement. Avoid vague answers; provide actionable steps and observed outcomes."
      }
    },
    {
      question: "You've gained experience in various areas, from full-stack development to competitive programming. What aspects of this Software Developer Intern role, specifically within backend or full-stack development, are you most excited about, and how do you see it aligning with your long-term career aspirations?",
      intention: "This question aims to understand the candidate's motivation, enthusiasm for the specific role, and how they envision their career path. It helps determine if their personal goals align with the opportunities offered by the internship.",
      how_to_answer: {
        points_to_cover: [
          "Express genuine enthusiasm for the role and the company",
          "Highlight specific responsibilities or technologies mentioned in the job description that align with your skills and interests (e.g., Node.js, MongoDB, scalable web applications, collaboration)",
          "Connect this internship to your interest in backend development and cloud technologies",
          "Discuss how this experience would help you grow professionally and contribute to your long-term career goals"
        ],
        approach: "Be specific and authentic. Research the company and role beforehand. Show how your current skills and future aspirations make you a good fit. Articulate what you hope to learn and how you plan to contribute, demonstrating a proactive and goal-oriented mindset."
      }
    }
  ],
  skills_gaps: [
    {
      skill: "Explicit Cloud Platform Expertise (AWS/Azure/GCP)",
      severity: "Medium",
      description: "While the candidate expresses interest in cloud technologies, there's limited hands-on experience with specific cloud providers or services. For a full-stack/backend role, understanding how to deploy and manage applications in a cloud environment is valuable."
    },
    {
      skill: "Professional Communication & Presentation Confidence",
      severity: "Medium",
      description: "The candidate acknowledges working on communication skills but could benefit from more structured practice in technical presentation and stakeholder communication."
    },
    {
      skill: "Advanced Database Optimization & Management",
      severity: "Low",
      description: "Experience with indexing strategies, query optimization, and database performance tuning would strengthen the candidate's backend development profile."
    },
    {
      skill: "Unit/Integration Testing Practices",
      severity: "Low",
      description: "Familiarity with testing frameworks (Jest, Mocha, etc.) and testing methodologies would improve code quality and reliability."
    }
  ],
  preparation_plan: [
    {
      day: "Day 1",
      focused_topic: "Data Structures & Algorithms",
      tasks: [
        "Review fundamental data structures (arrays, linked lists, hash maps, trees, graphs)",
        "Practice common algorithms (sorting, searching, two-pointers, recursion, basic dynamic programming) on LeetCode",
        "Focus on analyzing time and space complexity for all solutions",
        "Prioritize problems related to arrays, strings, and hash tables"
      ]
    },
    {
      day: "Day 2",
      focused_topic: "Backend Development (Node.js, Express.js, REST APIs)",
      tasks: [
        "Review Node.js asynchronous programming concepts (callbacks, Promises, async/await)",
        "Practice building a simple CRUD REST API using Express.js and MongoDB",
        "Understand HTTP methods, status codes, and proper API design principles (resource-based naming, handling query parameters)",
        "Be ready to explain how to secure APIs"
      ]
    },
    {
      day: "Day 3",
      focused_topic: "Databases (MongoDB) & Project Deep Dive",
      tasks: [
        "Review MongoDB CRUD operations, indexing, and basic aggregation queries",
        "Understand different data modeling approaches (embedding vs. referencing) for MongoDB",
        "Prepare to discuss 'Raksha' and 'Gym Website' projects in detail: architecture, technologies used, specific contributions, challenges faced, and how they were overcome",
        "Be ready to explain technical decisions"
      ]
    },
    {
      day: "Day 4",
      focused_topic: "Frontend (React.js) & Version Control (Git)",
      tasks: [
        "Review React.js fundamentals (components, props, state, hooks, component lifecycle)",
        "Understand how frontend and backend interact (e.g., fetching data from REST APIs)",
        "Practice essential Git commands (add, commit, push, pull, branch, merge, rebase) and common Git workflows",
        "Be able to explain concepts like pull requests and conflict resolution"
      ]
    },
    {
      day: "Day 5",
      focused_topic: "Behavioral Questions & Cloud Basics & Communication Practice",
      tasks: [
        "Prepare answers for common behavioral questions using the STAR method, focusing on teamwork, problem-solving, and learning experiences",
        "Specifically prepare for questions about communication skills and how you are actively improving them",
        "Research basic concepts of a popular cloud platform (e.g., AWS EC2, S3, Lambda or Azure equivalents) to cover the 'plus' requirement",
        "Practice self-introduction and articulating 'why this role' confidently"
      ]
    }
  ]
};

const sample2 = {
  'Match Score': 91,
  'Technical Questions': [
    {
      question: "Explain the concept of 'hoisting' in JavaScript. How does it apply to 'var', 'let', and 'const'?",
      intention: "To assess the candidate's fundamental understanding of JavaScript's execution context and variable declaration mechanisms.",
      how_to_answer: {
        points_to_cover: [
          "Definition of hoisting",
          "Behavior of 'var' (function-scoped)",
          "'let'/'const' (block-scoped)",
          "The Temporal Dead Zone"
        ],
        approach: "Start with a general definition, then provide specific examples for each keyword to illustrate the differences."
      }
    },
    {
      question: "You've used Node.js and Express.js. Describe the role of middleware in an Express.js application and provide a practical example of when you would use it.",
      intention: "To evaluate the candidate's practical experience and understanding of Express.js architecture and how to extend its functionality.",
      how_to_answer: {
        points_to_cover: [
          "What middleware is",
          "How it intercepts requests/responses",
          "The 'next()' function",
          "A clear use case"
        ],
        approach: "Define the concept, explain its flow, and then walk through a code example or a detailed scenario."
      }
    },
    {
      question: "In MongoDB, what are indexes, and why are they crucial for application performance? How would you decide which fields to index in your 'Raksha' project's database?",
      intention: "To test the candidate's knowledge of database optimization techniques and practical application in a NoSQL context.",
      how_to_answer: {
        points_to_cover: [
          "Definition of an index",
          "B-tree structure (optional but good)",
          "Performance benefits (query speed)",
          "Considerations for indexing (e.g., frequently queried fields, unique fields)"
        ],
        approach: "Define the concept, explain its benefits with analogy if helpful, and then apply it directly to a project scenario with rationale."
      }
    },
    {
      question: "Describe the architecture of your 'Raksha' (Disaster Management System) project. How do different components (frontend, backend, Appwrite) communicate with each other?",
      intention: "To understand the candidate's ability to think about system design at a high level and articulate technical flows within a project they built.",
      how_to_answer: {
        points_to_cover: [
          "Frontend (React)",
          "Backend (Node.js/Appwrite)",
          "Database (Appwrite's built-in DB)",
          "APIs",
          "User authentication flow",
          "Emergency alert system flow"
        ],
        approach: "Start with a high-level overview, then drill down into specific communication protocols and data exchange methods."
      }
    },
    {
      question: "You mentioned building REST APIs. What are the key principles of a RESTful API, and how would you design an API endpoint for fetching a list of active emergency alerts in your 'Raksha' system?",
      intention: "To assess understanding of REST architectural style and practical API design skills.",
      how_to_answer: {
        points_to_cover: [
          "Resource-based URLs",
          "HTTP methods (GET, POST, PUT, DELETE)",
          "Statelessness",
          "Status codes"
        ],
        approach: "Define the principles first, then demonstrate their application by designing a concrete API endpoint."
      }
    },
    {
      question: "How do you handle asynchronous operations in Node.js? Can you explain the difference between callbacks, Promises, and async/await?",
      intention: "To gauge understanding of JavaScript's asynchronous nature, critical for Node.js development, and evolution of handling async code.",
      how_to_answer: {
        points_to_cover: [
          "Event Loop (briefly)",
          "Callback Hell",
          "Promise chaining (.then(), .catch())",
          "async/await syntax",
          "Error handling in each method"
        ],
        approach: "Start with the problem of async code, then present each solution chronologically, highlighting advantages of newer methods."
      }
    },
    {
      question: "You've solved 50+ LeetCode problems. Describe a data structure that you find particularly useful for solving a specific type of problem, and provide an example.",
      intention: "To go beyond mere problem-solving count and assess deeper understanding of data structure applications and their performance implications.",
      how_to_answer: {
        points_to_cover: [
          "Data structure name",
          "Its characteristics",
          "Time/space complexity of operations",
          "A specific problem where it excels"
        ],
        approach: "Select a data structure, define it, explain its pros/cons for a certain problem type, and give a clear problem example."
      }
    },
    {
      question: "When collaborating on projects using Git, you encounter a merge conflict. Describe the steps you would take to resolve it.",
      intention: "To test practical Git workflow knowledge, especially in a team environment.",
      how_to_answer: {
        points_to_cover: [
          "Identifying conflict markers",
          "Using `git status`",
          "Opening the conflicted file",
          "Manual editing",
          "`git add`",
          "`git commit`"
        ],
        approach: "Simulate the scenario, list the commands, and describe the manual intervention required."
      }
    },
    {
      question: "How do you ensure the code you write is clean, readable, and maintainable, especially when working on a team project?",
      intention: "To assess awareness of code quality standards and best practices beyond just functionality.",
      how_to_answer: {
        points_to_cover: [
          "Meaningful variable/function names",
          "Small functions",
          "Clear comments (judiciously)",
          "Consistent formatting",
          "Modular design",
          "Adherence to style guides",
          "Self-documenting code"
        ],
        approach: "State the importance of clean code, then list specific actionable strategies and examples from your experience."
      }
    },
    {
      question: "You mentioned basic knowledge of cloud platforms is a plus for this role. What aspects of cloud computing are you most interested in, and why?",
      intention: "To explore the candidate's genuine interest in cloud technologies and assess their potential for learning in that area.",
      how_to_answer: {
        points_to_cover: [
          "Specific cloud services or concepts",
          "Potential benefits (scalability, cost-efficiency)",
          "How it relates to backend development",
          "Future learning goals"
        ],
        approach: "Be specific about areas of interest, show enthusiasm, and connect it to the job role or future career aspirations."
      }
    }
  ],
  'Behavioral Questions': [
    {
      question: "Tell me about a time you had to learn a new technology or framework quickly for a project. How did you approach it, and what was the outcome?",
      intention: "To assess the candidate's learning agility, resourcefulness, and ability to adapt to new tools and environments.",
      how_to_answer: {
        points_to_cover: [
          "Specific technology",
          "The challenge",
          "Steps taken to learn",
          "Difficulties encountered",
          "Positive outcome"
        ],
        approach: "Clearly structure your answer using STAR (Situation, Task, Action, Result) to provide a comprehensive response."
      }
    },
    {
      question: "Describe a challenging technical problem or bug you encountered in one of your projects (e.g., Raksha, Gym Website). How did you approach debugging and ultimately resolve it?",
      intention: "To evaluate problem-solving skills, persistence, debugging methodologies, and ability to learn from mistakes.",
      how_to_answer: {
        points_to_cover: [
          "Nature of the bug",
          "Initial assumptions",
          "Debugging tools used",
          "Collaboration (if any)",
          "Steps taken to isolate the problem",
          "The final solution"
        ],
        approach: "Walk through the problem-solving process logically, highlighting your analytical thinking and resilience."
      }
    },
    {
      question: "You've participated in hackathons and taken leadership roles. Tell me about a time you worked effectively in a team under pressure to meet a deadline.",
      intention: "To gauge teamwork, collaboration, time management, and performance under high-pressure situations.",
      how_to_answer: {
        points_to_cover: [
          "Team dynamics",
          "Division of labor",
          "Communication strategies",
          "Conflict resolution (if any)",
          "Successful delivery"
        ],
        approach: "Emphasize your role as a team player, your ability to contribute under pressure, and the positive team outcome."
      }
    },
    {
      question: "You mentioned sometimes struggling with confidence while speaking. Can you describe a situation where you found it challenging to communicate a technical idea, and what you learned from it?",
      intention: "To assess self-awareness, growth mindset, and proactive efforts in improving communication skills, a key 'preferred' skill.",
      how_to_answer: {
        points_to_cover: [
          "Specific communication challenge",
          "Impact of the challenge",
          "Strategies you're using to improve (e.g., practice, structured explanations)",
          "Observable progress"
        ],
        approach: "Be honest about the challenge, but focus heavily on your efforts towards improvement and the lessons learned."
      }
    },
    {
      question: "How do you prioritize tasks when you have multiple responsibilities or project deadlines? Can you give an example from your academic or project experience?",
      intention: "To understand the candidate's organizational skills, ability to manage workload, and decision-making under competing demands.",
      how_to_answer: {
        points_to_cover: [
          "Prioritization techniques (e.g., urgency vs. importance, impact analysis)",
          "Flexibility",
          "Communication with stakeholders",
          "Successful outcome"
        ],
        approach: "Clearly articulate your prioritization strategy and back it up with a concrete example."
      }
    },
    {
      question: "What interests you most about backend development, and what specific areas or technologies within backend development do you hope to explore or specialize in during this internship?",
      intention: "To assess genuine interest, motivation, and alignment with the role's focus on backend/full-stack.",
      how_to_answer: {
        points_to_cover: [
          "Reasons for backend preference",
          "Connection to problem-solving",
          "Specific Node.js/Express/MongoDB features of interest",
          "Interest in cloud platforms"
        ],
        approach: "Be enthusiastic, specific, and show how your interests align with the company's work and the internship's learning opportunities."
      }
    },
    {
      question: "Tell me about a time you received constructive criticism or feedback on your code or work. How did you react, and what did you do with that feedback?",
      intention: "To evaluate coachability, openness to feedback, and ability to improve based on input.",
      how_to_answer: {
        points_to_cover: [
          "Source of feedback",
          "Specific nature of the criticism",
          "Your initial reaction",
          "Steps taken to implement the feedback",
          "Improved outcome"
        ],
        approach: "Show humility, a willingness to learn, and demonstrate how you translate feedback into positive action."
      }
    },
    {
      question: "How do you ensure the quality of your work, especially when working on a project that might have a significant impact (like the Raksha system)?",
      intention: "To understand the candidate's commitment to quality, attention to detail, and awareness of the impact of their work.",
      how_to_answer: {
        points_to_cover: [
          "Thorough testing (manual/automated if applicable)",
          "Understanding requirements",
          "Error handling",
          "Input validation",
          "Code reviews (even self-reviews)",
          "Thinking about potential failures"
        ],
        approach: "Provide concrete examples of how you integrate quality checks throughout your development process."
      }
    },
    {
      question: "You listed experience as a 'Software Specialist' and 'Technical Coordinator'. Can you describe a time when you took initiative to solve a problem or improve a process, even if it wasn't explicitly your responsibility?",
      intention: "To assess proactiveness, initiative, and leadership potential, even in an intern role.",
      how_to_answer: {
        points_to_cover: [
          "Identifying the problem",
          "Taking ownership",
          "Planning",
          "Execution",
          "The benefits achieved"
        ],
        approach: "Highlight your ability to identify needs and proactively contribute beyond your defined role."
      }
    },
    {
      question: "Where do you see yourself in terms of skill development in the next year, particularly concerning backend and cloud technologies, and how does this internship align with those goals?",
      intention: "To understand the candidate's career aspirations, self-motivation, and how well they've researched and aligned their goals with the company and role.",
      how_to_answer: {
        points_to_cover: [
          "Specific technologies/concepts you want to master",
          "Practical application goals",
          "How the company's projects/mentorship will contribute"
        ],
        approach: "Be specific and demonstrate how this role is a stepping stone for your long-term technical growth."
      }
    }
  ],
  'Skills Gaps': [
    {
      skill: "Cloud Platform Experience",
      severity: "Medium",
      description: "The candidate expresses interest in cloud technologies, and basic knowledge is a 'plus' for the role. However, there's no mention of hands-on experience with specific cloud providers (AWS, Azure, GCP) or services (e.g., EC2, Lambda, S3, Docker/Kubernetes deployments). For a full-stack/backend role, understanding how to deploy and manage applications in a cloud environment is valuable."
    },
    {
      skill: "Testing Frameworks & Methodologies",
      severity: "Medium",
      description: "While the candidate has strong project experience, there's no explicit mention of experience with unit testing, integration testing, or end-to-end testing frameworks (e.g., Jest, Mocha, Cypress for JavaScript applications). Writing maintainable and robust code often involves a good testing strategy."
    },
    {
      skill: "Deployment & CI/CD Pipelines",
      severity: "Medium",
      description: "The resume focuses on development and Appwrite (which abstracts much of deployment). There's no explicit mention of experience with continuous integration/continuous deployment (CI/CD) pipelines or understanding how applications are deployed to production environments beyond local development."
    },
    {
      skill: "Advanced JavaScript & Node.js Concepts (beyond immediate use)",
      severity: "Low",
      description: "The candidate uses React and Node.js, indicating familiarity. However, a deeper understanding of less common but critical concepts like the Node.js event loop's nuances, advanced error handling patterns, memory management, or specific performance optimizations might not be as strong as core development skills. This is a common gap for students and is expected to be learned on the job."
    }
  ],
  'preparationPlan': [
    {
      day: 1,
      focused_topic: "Data Structures and Algorithms & Problem Solving",
      task: [
        "Revise fundamental data structures (Arrays, Linked Lists, Trees, Hash Maps)",
        "Solve 2–3 medium-level LeetCode problems",
        "Focus on problem-solving approach and complexity analysis",
        "Review recursion and dynamic programming basics"
      ]
    },
    {
      day: 2,
      focused_topic: "JavaScript & Node.js Fundamentals",
      task: [
        "Study hoisting, closures, this keyword, and event loop",
        "Practice async/await and Promises",
        "Write small Node.js scripts using core modules (fs, http, path)",
        "Understand npm and package.json",
        "Learn how modules work in Node.js"
      ]
    },
    {
      day: 3,
      focused_topic: "Express.js, MongoDB & REST API Design",
      task: [
        "Build a mini Express API with routing and middleware",
        "Practice MongoDB CRUD operations and indexing",
        "Understand aggregation basics",
        "Design RESTful API endpoints for a sample project"
      ]
    },
    {
      day: 4,
      focused_topic: "Projects Deep Dive, Git & Cloud Fundamentals",
      task: [
        "Prepare detailed explanation of Raksha and Gym Website projects",
        "Explain architecture, challenges, and solutions",
        "Review Git advanced commands (rebase, cherry-pick, merge conflicts)",
        "Learn cloud basics: IaaS, PaaS, SaaS, serverless",
        "Explore AWS basics (EC2, S3, Lambda)"
      ]
    },
    {
      day: 5,
      focused_topic: "Behavioral Questions & Communication Practice",
      task: [
        "Practice behavioral questions using STAR method",
        "Rehearse answers about teamwork, leadership, and problem-solving",
        "Prepare 3–5 questions for interviewer",
        "Work on confidence and clear communication"
      ]
    }
  ]
};

module.exports = { sample1, sample2 };