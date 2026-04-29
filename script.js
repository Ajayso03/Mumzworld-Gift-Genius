document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    const quickPrompts = document.querySelectorAll('.quick-prompt-btn');

    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight < 120 ? this.scrollHeight : 120) + 'px';
        
        if (this.value.trim().length > 0) {
            sendBtn.removeAttribute('disabled');
        } else {
            sendBtn.setAttribute('disabled', 'true');
        }
    });

    // Handle Enter key to send
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (this.value.trim().length > 0) {
                sendMessage();
            }
        }
    });

    sendBtn.addEventListener('click', sendMessage);

    // Quick Prompts
    quickPrompts.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.getAttribute('data-query');
            userInput.value = query;
            // Trigger input event to resize textarea and enable button
            userInput.dispatchEvent(new Event('input'));
            sendMessage();
        });
    });

    function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        // Add user message
        appendMessage(text, 'user');
        
        // Clear input
        userInput.value = '';
        userInput.style.height = 'auto';
        sendBtn.setAttribute('disabled', 'true');
        
        // Show typing indicator
        showTypingIndicator();

        // Simulate AI Processing (RAG + Generation)
        setTimeout(() => {
            removeTypingIndicator();
            generateResponse(text);
        }, 1500 + Math.random() * 1000); // 1.5 - 2.5s delay
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Split by newlines for paragraphs
        const paragraphs = text.split('\n').filter(p => p.trim() !== '');
        paragraphs.forEach(p => {
            const pElem = document.createElement('p');
            // Basic markdown support for bolding
            pElem.innerHTML = p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            contentDiv.appendChild(pElem);
        });

        msgDiv.appendChild(contentDiv);
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
        
        return msgDiv;
    }

    function appendProducts(products) {
        if (!products || products.length === 0) return;

        const container = document.createElement('div');
        container.className = 'products-container';
        
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            card.innerHTML = `
                <div class="product-img-wrapper">
                    <img src="${product.image}" alt="${product.title}">
                    ${product.safe ? '<div class="safety-badge"><i class="fa-solid fa-shield-check"></i> Certified Safe</div>' : ''}
                </div>
                <div class="product-info">
                    <h4 class="product-title">${product.title}</h4>
                    <div class="product-meta">
                        <span><i class="fa-regular fa-clock"></i> ${product.age}</span>
                        <span><i class="fa-solid fa-star" style="color:var(--warning)"></i> ${product.rating}</span>
                    </div>
                    <div class="product-price">$${product.price}</div>
                    <button class="add-to-cart mt-2">Add to Cart</button>
                </div>
            `;
            container.appendChild(card);
        });

        chatMessages.appendChild(container);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const indicator = document.createElement('div');
        indicator.id = id;
        indicator.className = 'message assistant typing';
        indicator.innerHTML = `
            <div class="typing-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        `;
        chatMessages.appendChild(indicator);
        scrollToBottom();
        chatMessages.dataset.typingId = id;
    }

    function removeTypingIndicator() {
        const id = chatMessages.dataset.typingId;
        if (id) {
            const el = document.getElementById(id);
            if (el) el.remove();
            delete chatMessages.dataset.typingId;
        }
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Simulated RAG Knowledge Base
    const productCatalog = {
        coworker: [
            {
                title: "Organic Cotton Baby Gift Set (5-Piece)",
                price: "45.00",
                age: "0-6m",
                rating: "4.9",
                safe: true,
                image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80"
            },
            {
                title: "Silicone Feeding Set & Bib Bundle",
                price: "34.99",
                age: "6m+",
                rating: "4.8",
                safe: true,
                image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=80"
            }
        ],
        safeToys: [
            {
                title: "Montessori Wooden Shape Sorter",
                price: "29.99",
                age: "6-12m",
                rating: "4.9",
                safe: true,
                image: "https://images.unsplash.com/photo-1590845947698-8924d7409b56?w=400&q=80"
            },
            {
                title: "Soft Crinkle Activity Book",
                price: "18.50",
                age: "3m+",
                rating: "4.7",
                safe: true,
                image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80"
            },
            {
                title: "BPA-Free Teething Tubes Set",
                price: "14.99",
                age: "4m+",
                rating: "4.9",
                safe: true,
                image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80"
            }
        ],
        premium: [
            {
                title: "Smart HD Baby Monitor with Breathing Band",
                price: "299.00",
                age: "0-2y",
                rating: "4.9",
                safe: true,
                image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80"
            },
            {
                title: "Luxury Self-Folding Travel Stroller",
                price: "450.00",
                age: "6m-3y",
                rating: "4.8",
                safe: true,
                image: "https://images.unsplash.com/photo-1515444744559-7be63e1600de?w=400&q=80"
            }
        ]
    };

    function generateResponse(query) {
        const lowerQuery = query.toLowerCase();
        let responseText = "";
        let recommendedProducts = [];

        if (lowerQuery.includes("coworker") || (lowerQuery.includes("budget") && lowerQuery.includes("50"))) {
            responseText = "That's so thoughtful of you! For a coworker, a gender-neutral gift set is always a safe and highly appreciated choice. \n\nI checked our inventory against safety standards and reviews <span class='citation'>[1]</span>, and these options under $50 are beautifully packaged and extremely practical.";
            recommendedProducts = productCatalog.coworker;
        } 
        else if (lowerQuery.includes("safe") || lowerQuery.includes("toy") || lowerQuery.includes("6-month") || lowerQuery.includes("6 month")) {
            responseText = "At 6 months, babies are exploring with their hands and mouths, so safety is our #1 priority. \n\nI've filtered our catalog for **BPA-free materials**, **no choking hazards**, and **developmental benefits** <span class='citation'>[2]</span>. Here are the top-rated educational toys perfect for this age:";
            recommendedProducts = productCatalog.safeToys;
        }
        else if (lowerQuery.includes("premium") || lowerQuery.includes("sister") || lowerQuery.includes("first")) {
            responseText = "A first baby is such a special milestone! For a sister, you want something truly memorable and incredibly useful. \n\nI cross-referenced our highest-rated premium tech and gear <span class='citation'>[3]</span>. These items give new parents immense peace of mind and convenience:";
            recommendedProducts = productCatalog.premium;
        }
        else {
            responseText = "I've searched our Mumzworld catalog for the best matches based on safety, age guidelines, and quality. Here are some wonderful recommendations tailored for you:";
            // Return a mix as a fallback
            recommendedProducts = [productCatalog.safeToys[0], productCatalog.premium[0]];
        }

        appendMessage(responseText, 'assistant');
        appendProducts(recommendedProducts);
    }
});
