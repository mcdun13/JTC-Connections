const categories = [
    {
        title: "Things found at recess",
        words: ["Football", "Swing", "Track", "Soccer ball"],
        color: "yellow",
        difficulty: 1
    },
    {
        title: "What you'll find in the front office",
        words: ["Nurse", "Turtle", "Dylan", "Erick"],
        color: "green",
        difficulty: 2
    },
    {
        title: "Radio code colors",
        words: ["School bus", "Grass", "Blood", "Basketball"],
        color: "blue",
        difficulty: 3
    },
    {
        title: "Connections to reset areas (Minecraft, Pokémon, Ocean, Focus)",
        words: ["Steve", "May", "Indian", "Meditation"],
        color: "purple",
        difficulty: 4
    }
];

let remainingWords = [];
let selectedWords = [];
let solvedCategories = [];
let mistakesRemaining = 4;
let gameOver = false;
let previousGuesses = [];
let guessHistory = []; // Track all guesses with their results

function initGame() {
    remainingWords = categories.flatMap(cat => cat.words);
    shuffleArray(remainingWords);
    renderGrid();
    updateMistakes();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    
    remainingWords.forEach(word => {
        const tile = document.createElement('div');
        tile.className = 'word-tile';
        if (selectedWords.includes(word)) {
            tile.classList.add('selected');
        }
        tile.textContent = word;
        tile.onclick = () => toggleWord(word);
        grid.appendChild(tile);
    });

    updateSubmitButton();
}

function toggleWord(word) {
    if (gameOver) return;

    const index = selectedWords.indexOf(word);
    if (index > -1) {
        selectedWords.splice(index, 1);
    } else {
        if (selectedWords.length < 4) {
            selectedWords.push(word);
        }
    }
    renderGrid();
}

function deselectAll() {
    selectedWords = [];
    renderGrid();
    hideMessage();
}

function shuffleWords() {
    shuffleArray(remainingWords);
    renderGrid();
}

function updateSubmitButton() {
    const btn = document.getElementById('submitBtn');
    if (selectedWords.length !== 4) {
        btn.disabled = true;
        return;
    }
    
    // Check if this exact guess has been tried before
    const sortedGuess = [...selectedWords].sort().join(',');
    const alreadyGuessed = previousGuesses.some(guess => 
        [...guess].sort().join(',') === sortedGuess
    );
    
    btn.disabled = alreadyGuessed;
}

function submitGuess() {
    if (selectedWords.length !== 4 || gameOver) return;

    // Add this guess to previous guesses
    previousGuesses.push([...selectedWords]);

    hideMessage();

    // Check if selection matches any category
    const matchedCategory = categories.find(cat => {
        if (solvedCategories.includes(cat)) return false;
        return cat.words.every(word => selectedWords.includes(word));
    });

    if (matchedCategory) {
        // Correct guess - bounce animation!
        guessHistory.push({ correct: true, category: matchedCategory, words: [...selectedWords] });
        
        const tiles = document.querySelectorAll('.word-tile.selected');
        tiles.forEach((tile, index) => {
            setTimeout(() => {
                tile.classList.add('bounce');
            }, index * 100);
        });

        setTimeout(() => {
            solvedCategories.push(matchedCategory);
            remainingWords = remainingWords.filter(word => !selectedWords.includes(word));
            selectedWords = [];
            
            renderSolvedCategory(matchedCategory);
            renderGrid();

            // Check win condition
            if (solvedCategories.length === 4) {
                setTimeout(() => showEndScreen(true), 1000);
            }
        }, 800);
    } else {
        // Incorrect guess - shake animation!
        guessHistory.push({ correct: false, words: [...selectedWords] });
        
        const tiles = document.querySelectorAll('.word-tile.selected');
        tiles.forEach(tile => {
            tile.classList.add('shake');
        });

        setTimeout(() => {
            tiles.forEach(tile => {
                tile.classList.remove('shake');
            });

            // Always count the mistake first
            mistakesRemaining--;
            updateMistakes();

            // Check if one away (for message only)
            const oneAway = categories.find(cat => {
                if (solvedCategories.includes(cat)) return false;
                const matches = cat.words.filter(word => selectedWords.includes(word)).length;
                return matches === 3;
            });

            if (oneAway) {
                showMessage("One away...", "one-away");
            }
            
            if (mistakesRemaining === 0) {
                gameOver = true;
                // Show all remaining categories
                categories.forEach(cat => {
                    if (!solvedCategories.includes(cat)) {
                        renderSolvedCategory(cat);
                    }
                });
                setTimeout(() => showEndScreen(false), 1500);
            }
            
            // Keep selection highlighted after incorrect guess
            renderGrid();
        }, 300);
    }
}

function renderSolvedCategory(category) {
    const container = document.getElementById('solvedCategories');
    const div = document.createElement('div');
    div.className = `category-result ${category.color}`;
    div.innerHTML = `
        <div class="category-title">${category.title}</div>
        <div class="category-words">${category.words.join(', ')}</div>
    `;
    container.appendChild(div);
}

function updateMistakes() {
    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`dot${i}`);
        if (4 - i < mistakesRemaining) {
            dot.classList.remove('used');
        } else {
            dot.classList.add('used');
        }
    }
}

function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = `message ${type} show`;
    
    setTimeout(() => {
        msg.classList.remove('show');
    }, 2000);
}

function hideMessage() {
    const msg = document.getElementById('message');
    msg.classList.remove('show');
}

function showEndScreen(won) {
    document.getElementById('grid').style.display = 'none';
    document.querySelector('.controls').style.display = 'none';
    document.querySelector('.mistakes').style.display = 'none';
    
    const endScreen = document.getElementById('endScreen');
    const endTitle = document.getElementById('endTitle');
    const endMessage = document.getElementById('endMessage');
    const emojiSummary = document.getElementById('emojiSummary');
    
    if (won) {
        endTitle.textContent = '🎉 Congratulations! 🎉';
        endMessage.textContent = 'You solved all the categories!';
    } else {
        endTitle.textContent = 'Game Over';
        endMessage.textContent = 'Better luck next time!';
    }
    
    // Generate emoji summary
    emojiSummary.innerHTML = generateEmojiSummary();
    
    endScreen.classList.add('show');
}

function generateEmojiSummary() {
    const colorEmojis = {
        'yellow': '🟨',
        'green': '🟩',
        'blue': '🟦',
        'purple': '🟪'
    };
    
    let rows = [];
    
    guessHistory.forEach(guess => {
        if (guess.correct) {
            // Correct guess - all 4 same color
            const emoji = colorEmojis[guess.category.color];
            rows.push(emoji + emoji + emoji + emoji);
        } else {
            // Incorrect guess - show mixed colors based on which category each word belongs to
            let row = '';
            guess.words.forEach(word => {
                const wordCategory = categories.find(cat => cat.words.includes(word));
                row += colorEmojis[wordCategory.color];
            });
            rows.push(row);
        }
    });
    
    return rows.join('<br>');
}

function shareResults() {
    const colorEmojis = {
        'yellow': '🟨',
        'green': '🟩',
        'blue': '🟦',
        'purple': '🟪'
    };
    
    let rows = ['JTC Connections'];
    
    guessHistory.forEach(guess => {
        if (guess.correct) {
            // Correct guess - all 4 same color
            const emoji = colorEmojis[guess.category.color];
            rows.push(emoji + emoji + emoji + emoji);
        } else {
            // Incorrect guess - show mixed colors based on which category each word belongs to
            let row = '';
            guess.words.forEach(word => {
                const wordCategory = categories.find(cat => cat.words.includes(word));
                row += colorEmojis[wordCategory.color];
            });
            rows.push(row);
        }
    });
    
    let result = rows.join('\n');
    
    // Copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(result).then(() => {
            const btn = document.querySelector('.share-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Copy failed:', err);
            alert('Could not copy to clipboard: ' + result);
        });
    } else {
        // Fallback for browsers that don't support clipboard API
        alert('Copy this:\n\n' + result);
    }
}

function resetGame() {
    // Reset all game state
    remainingWords = [];
    selectedWords = [];
    solvedCategories = [];
    mistakesRemaining = 4;
    gameOver = false;
    previousGuesses = [];
    guessHistory = [];
    
    // Reset UI
    document.getElementById('solvedCategories').innerHTML = '';
    document.getElementById('grid').style.display = 'grid';
    document.querySelector('.controls').style.display = 'flex';
    document.querySelector('.mistakes').style.display = 'block';
    document.getElementById('endScreen').classList.remove('show');
    
    // Reset mistake dots
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`dot${i}`).classList.remove('used');
    }
    
    hideMessage();
    initGame();
}

// Initialize game on load
initGame();
