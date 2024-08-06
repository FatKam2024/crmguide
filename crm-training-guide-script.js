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
        `;
    }

    function createTopicList() {
        const topicList = document.getElementById('topicList');
        Object.entries(crmTrainingGuide).forEach(([category, categoryInfo]) => {
            const li = document.createElement('li');
            const categorySpan = document.createElement('span');
            categorySpan.className = 'category';
            categorySpan.textContent = category;
            categorySpan.addEventListener('click', (e) => {
                e.stopPropagation();
                li.classList.toggle('expanded');
                showCategoryDetails(category);
            });
            li.appendChild(categorySpan);

            const ul = document.createElement('ul');
            Object.keys(categoryInfo.topics).forEach(topic => {
                const topicLi = document.createElement('li');
                topicLi.className = 'topic';
                topicLi.textContent = topic;
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
            <div class="breadcrumb">
                <a href="#">Home</a> &gt; <span id="currentTopic">${category}</span>
            </div>
            <h2>${category}</h2>
            <p>${categoryInfo.description.english}</p>
            <p class="chinese">${categoryInfo.description.chinese}</p>
            <h3>Topics in this category:</h3>
            <ul>
                ${Object.keys(categoryInfo.topics).map(topic => `<li>${topic}</li>`).join('')}
            </ul>
        `;
    }

    function showTopicDetails(category, topic) {
        const contentArea = document.getElementById('contentArea');
        const topicInfo = crmTrainingGuide[category].topics[topic];
        contentArea.innerHTML = `
            <div class="breadcrumb">
                <a href="#">Home</a> &gt; ${category} &gt; <span id="currentTopic">${topic}</span>
            </div>
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
        completedTopics++;
        updateProgress();
    }

    function updateProgress() {
        const progress = (completedTopics / totalTopics) * 100;
        document.getElementById('progressBar').style.width = `${progress}%`;
    }

    fetch('crm-training-guide-data.json')
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
            } else {
                category.classList.remove('expanded');
            }
        });
    });

    // Theme toggle functionality
    const toggleTheme = document.getElementById('toggleTheme');
    toggleTheme.addEventListener('click', function() {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
        updateThemeButtonText();
    });

    function updateThemeButtonText() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        toggleTheme.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    }

    // Check for saved theme preference or use system preference
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

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addListener(function(e) {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.remove('light-mode');
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
                document.body.classList.add('light-mode');
            }
            updateThemeButtonText();
        }
    });

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const topics = document.querySelectorAll('.topic');
        topics.forEach(topic => {
            const topicText = topic.textContent.toLowerCase();
            topic.style.display = topicText.includes(searchTerm) ? '' : 'none';
        });
    });

    // Quiz functionality
    document.querySelector('.quiz-submit').addEventListener('click', function() {
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
    });

    // Interactive diagram functionality
    const diagramElements = document.querySelectorAll('.diagram-element');
    const diagramInfo = document.getElementById('diagramInfo');
    const diagramData = {
        'core-crm': 'The central system that manages customer interactions and data throughout the customer lifecycle.',
        'sales': 'Manages leads, opportunities, and the sales pipeline.',
        'marketing': 'Handles campaigns, lead generation, and customer segmentation.',
        'service': 'Manages customer support tickets, service level agreements, and customer satisfaction.',
        'analytics': 'Provides insights and reports on customer data and business performance.'
    };

    diagramElements.forEach(element => {
        element.addEventListener('click', function() {
            const info = diagramData[this.dataset.info];
            diagramInfo.textContent = info;
            diagramInfo.style.display = 'block';
        });
    });
});