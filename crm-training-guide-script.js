document.addEventListener('DOMContentLoaded', function() {
    let crmTrainingGuide;
    let sidebarExpanded = false;
    let completedTopics = 0;
    let totalTopics = 0;

    function showInitialContent() {
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = `
            <h1>Comprehensive CRM Training Guide</h1>
            <p>Welcome to our comprehensive guide on Customer Relationship Management (CRM). Please select a category or topic from the sidebar to view its details.</p>
            <p>Hover over <span class="tooltip">highlighted terms<span class="tooltiptext">Terms with additional information</span></span> for quick definitions.</p>
            
            <section class="quiz-container" aria-labelledby="quizTitle">
                <h3 id="quizTitle">Quick Quiz</h3>
                <div class="quiz-question"><strong>What does CRM stand for?</strong></div>
                <div class="quiz-options">
                    <label><input type="radio" name="crm-quiz" value="1"> Customer Relationship Management</label>
                    <label><input type="radio" name="crm-quiz" value="2"> Customer Resource Management</label>
                    <label><input type="radio" name="crm-quiz" value="3"> Client Retention Method</label>
                </div>
                <button class="quiz-submit" aria-live="polite">Submit Answer</button>
                <div class="quiz-feedback" role="alert" aria-live="assertive"></div>
            </section>

            <section class="interactive-diagram" aria-labelledby="diagramTitle">
                <h3 id="diagramTitle">CRM Ecosystem</h3>
                <svg width="300" height="200" viewBox="0 0 300 200" role="img" aria-labelledby="diagramDescription">
                    <title id="diagramDescription">Diagram of CRM Ecosystem</title>
                    <circle cx="150" cy="100" r="80" fill="#3498db" class="diagram-element" data-info="core-crm" tabindex="0"/>
                    <text x="150" y="105" text-anchor="middle" fill="white" font-size="14">Core CRM</text>
                    <circle cx="50" cy="50" r="30" fill="#e74c3c" class="diagram-element" data-info="sales" tabindex="0"/>
                    <text x="50" y="55" text-anchor="middle" fill="white" font-size="12">Sales</text>
                    <circle cx="250" cy="50" r="30" fill="#2ecc71" class="diagram-element" data-info="marketing" tabindex="0"/>
                    <text x="250" y="55" text-anchor="middle" fill="white" font-size="12">Marketing</text>
                    <circle cx="50" cy="150" r="30" fill="#f39c12" class="diagram-element" data-info="service" tabindex="0"/>
                    <text x="50" y="155" text-anchor="middle" fill="white" font-size="12">Service</text>
                    <circle cx="250" cy="150" r="30" fill="#9b59b6" class="diagram-element" data-info="analytics" tabindex="0"/>
                    <text x="250" y="155" text-anchor="middle" fill="white" font-size="12">Analytics</text>
                </svg>
                <div id="diagramInfo" class="diagram-info"></div>
            </section>
        `;

        attachQuizListener();
        attachDiagramListeners();
    }

    function createTopicList() {
        const topicList = document.getElementById('topicList');
        Object.entries(crmTrainingGuide).forEach(([category, categoryInfo]) => {
            const li = document.createElement('li');
            const categorySpan = document.createElement('span');
            categorySpan.className = 'category';
            categorySpan.textContent = category;
            categorySpan.tabIndex = 0;
            categorySpan.setAttribute('aria-expanded', 'false');
            categorySpan.addEventListener('click', (e) => {
                e.stopPropagation();
                li.classList.toggle('expanded');
                const isExpanded = li.classList.contains('expanded');
                categorySpan.setAttribute('aria-expanded', isExpanded);
                showCategoryDetails(category);
            });
            li.appendChild(categorySpan);

            const ul = document.createElement('ul');
            Object.keys(categoryInfo.topics).forEach(topic => {
                const topicLi = document.createElement('li');
                topicLi.className = 'topic';
                topicLi.textContent = topic;
                topicLi.dataset.category = category;
                topicLi.dataset.topic = topic;
                topicLi.tabIndex = 0;
                topicLi.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showTopicDetails(category, topic);
                });
                ul.appendChild(topicLi);
                totalTopics++;
            });
            li.appendChild(ul);
            topicList.appendChild(li);
        });
        showInitialContent();
        updateProgress();
    }

    function showCategoryDetails(category) {
        const contentArea = document.getElementById('contentArea');
        const categoryInfo = crmTrainingGuide[category];
        contentArea.innerHTML = `
            <nav class="breadcrumb" aria-label="Breadcrumb">
                <a href="#" data-action="home" aria-current="page">Home</a> &gt; <span id="currentTopic">${category}</span>
            </nav>
            <h2>${category}</h2>
            <p>${categoryInfo.description.english}</p>
            <p class="chinese">${categoryInfo.description.chinese}</p>
            <h3>Topics in this category:</h3>
            <ul>
                ${Object.keys(categoryInfo.topics).map(topic => `<li>${topic}</li>`).join('')}
            </ul>
        `;
        attachBreadcrumbListeners();
    }

    function showTopicDetails(category, topic) {
        const contentArea = document.getElementById('contentArea');
        const topicInfo = crmTrainingGuide[category].topics[topic];
        contentArea.innerHTML = `
            <nav class="breadcrumb" aria-label="Breadcrumb">
                <a href="#" data-action="home">Home</a> &gt; 
                <a href="#" data-action="category" data-category="${category}">${category}</a> &gt; 
                <span id="currentTopic">${topic}</span>
            </nav>
            <h2>${topic}</h2>
            <h3>English</h3>
            <p><strong>Definition:</strong> ${topicInfo.english.definition}</p>
            <h4>Key Points:</h4>
            <ul>
                ${topicInfo.english.keyPoints.map(point => `<li>${point}</li>`).join('')}
            </ul>
            <h4>Subtopics:</h4>
            <ul>
                ${topicInfo.english.subtopics.map(subtopic => `<li>${subtopic}</li>`).join('')}
            </ul>
            <p><strong>Example:</strong> ${topicInfo.english.example}</p>
            
            <h3 class="chinese">繁體中文</h3>
            <p><strong>定義：</strong> ${topicInfo.chinese.definition}</p>
            <h4>主要要點：</h4>
            <ul>
                ${topicInfo.chinese.keyPoints.map(point => `<li>${point}</li>`).join('')}
            </ul>
            <h4>子主題：</h4>
            <ul>
                ${topicInfo.chinese.subtopics.map(subtopic => `<li>${subtopic}</li>`).join('')}
            </ul>
            <p><strong>例子：</strong> ${topicInfo.chinese.example}</p>
        `;
        if (!topicInfo.completed) {
            completedTopics++;
            topicInfo.completed = true;
            updateProgress();
        }
        attachBreadcrumbListeners();
    }

    function attachBreadcrumbListeners() {
        const breadcrumbLinks = document.querySelectorAll('.breadcrumb a');
        breadcrumbLinks.forEach(link => {
            link.addEventListener('click', handleBreadcrumbClick);
        });
    }

    function handleBreadcrumbClick(event) {
        event.preventDefault();
        const action = event.target.dataset.action;
        if (action === 'home') {
            showInitialContent();
        } else if (action === 'category') {
            const category = event.target.dataset.category;
            showCategoryDetails(category);
        }
    }

    function updateProgress() {
        const progress = (completedTopics / totalTopics) * 100;
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
    }

    function attachQuizListener() {
        const quizSubmit = document.querySelector('.quiz-submit');
        if (quizSubmit) {
            quizSubmit.addEventListener('click', handleQuizSubmission);
        }
    }

    function attachDiagramListeners() {
        const diagramElements = document.querySelectorAll('.diagram-element');
        diagramElements.forEach(element => {
            element.addEventListener('click', handleDiagramClick);
            element.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleDiagramClick.call(this, e);
                }
            });
        });
    }

    function handleQuizSubmission() {
        const selectedAnswer = document.querySelector('input[name="crm-quiz"]:checked');
        const feedbackElement = document.querySelector('.quiz-feedback');
        
        if (selectedAnswer) {
            if (selectedAnswer.value === "1") {
                feedbackElement.textContent = "Correct! CRM stands for Customer Relationship Management.";
                feedbackElement.style.color = "green";
            } else {
                feedbackElement.textContent = "Incorrect. The correct answer is Customer Relationship Management.";
                feedbackElement.style.color = "red";
            }
        } else {
            feedbackElement.textContent = "Please select an answer.";
            feedbackElement.style.color = "black";
        }
    }

    function handleDiagramClick() {
        const diagramInfo = document.getElementById('diagramInfo');
        const info = diagramData[this.dataset.info];
        diagramInfo.textContent = info;
        diagramInfo.style.display = 'block';
    }

    const diagramData = {
        'core-crm': 'The central system that manages customer interactions and data throughout the customer lifecycle.',
        'sales': 'Manages leads, opportunities, and the sales pipeline.',
        'marketing': 'Handles campaigns, lead generation, and customer segmentation.',
        'service': 'Manages customer support tickets, service level agreements, and customer satisfaction.',
        'analytics': 'Provides insights and reports on customer data and business performance.'
    };

    fetch('./crm-training-guide-data.json')
        .then(response => response.json())
        .then(data => {
            crmTrainingGuide = data;
            createTopicList();
        })
        .catch(error => console.error('Error loading CRM training guide data:', error));

    const toggleSidebar = document.getElementById('toggleSidebar');
    toggleSidebar.addEventListener('click', function() {
        sidebarExpanded = !sidebarExpanded;
        const categories = document.querySelectorAll('#topicList > li');
        categories.forEach(category => {
            if (sidebarExpanded) {
                category.classList.add('expanded');
                category.querySelector('.category').setAttribute('aria-expanded', 'true');
            } else {
                category.classList.remove('expanded');
                category.querySelector('.category').setAttribute('aria-expanded', 'false');
            }
        });
        adjustLayout(); // Adjust layout dynamically when toggling sidebar
        toggleSidebar.setAttribute('aria-expanded', sidebarExpanded);
    });

    const toggleTheme = document.getElementById('toggleTheme');
    toggleTheme.addEventListener('click', function() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        updateThemeButtonText();
        toggleTheme.setAttribute('aria-pressed', isDarkMode);
    });

    function updateThemeButtonText() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        toggleTheme.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.add('light-mode');
    }
    updateThemeButtonText();

    window.matchMedia('(prefers-color-scheme: dark)').addListener(function(e) {
        if (!localStorage.getItem('theme')) {
            document.body.classList.toggle('dark-mode', e.matches);
            updateThemeButtonText();
        }
    });

    document.getElementById('searchInput').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const topics = document.querySelectorAll('.topic');
        topics.forEach(topic => {
            const topicText = topic.textContent.toLowerCase();
            const category = topic.closest('li').querySelector('.category');
            const isVisible = topicText.includes(searchTerm);
            topic.style.display = isVisible ? '' : 'none';
            if (isVisible) {
                category.classList.add('expanded');
                category.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Adjust layout based on window size
    window.addEventListener('resize', adjustLayout);

    function adjustLayout() {
        const contentArea = document.querySelector('.content');
        if (window.innerWidth <= 768) {
            // Mobile view adjustments
            contentArea.style.marginLeft = '0';
            contentArea.style.paddingLeft = sidebarExpanded ? '0' : '20px';
        } else {
            // Desktop view adjustments
            contentArea.style.marginLeft = sidebarExpanded ? '280px' : '0';
        }
    }

    // Initial layout adjustment
    adjustLayout();
});
