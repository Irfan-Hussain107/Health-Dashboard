function ScoreDisplay({ score, description }) {
    const getScoreColor = (grade) => {
        if (['A+', 'A', 'B'].includes(grade)) return 'bg-green-600 text-green-100';
        if (['C', 'D'].includes(grade)) return 'bg-yellow-600 text-yellow-100';
        if (['F'].includes(grade)) return 'bg-red-600 text-red-100';
        return 'bg-gray-600 text-gray-100';
    };

    return (
        <div className={`p-6 rounded-lg text-center ${getScoreColor(score)}`}>
            <p className="text-lg">Overall Environmental Health Grade</p>
            <p className="text-7xl font-bold my-2">{score}</p>
            <p className="text-xl">{description}</p>
        </div>
    );
}

export default ScoreDisplay;