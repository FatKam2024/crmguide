document.addEventListener('DOMContentLoaded', function() {
    let crmTrainingGuide;
    let sidebarExpanded = false;

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
            });
            li.appendChild(ul);
            topicList.appendChild(li);
        });
        showInitialContent();
    }

    function showCategoryDetails(category) {
        const contentArea = document.getElementById('contentArea');
        const categoryInfo = crmTrainingGuide[category];
        contentArea.innerHTML = `
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
});