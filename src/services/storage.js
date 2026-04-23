const STORAGE_KEY = "quiz_files";

export function saveQuiz(name, data) {
    const quizzes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    quizzes.push({
        id: Date.now(),
        name,
        data
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
}

export function getQuizzes() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function getQuizById(id) {
    return getQuizzes().find(q => q.id === id);
}