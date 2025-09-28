function Gauge({ title, value, rating, color }) {
    return (
        <div className="bg-gray-700/50 p-4 rounded-lg text-center">
            <h4 className="text-lg font-semibold text-gray-300">{title}</h4>
            <div className="my-3">
                <span className="text-5xl font-bold text-white">{value}</span>
            </div>
            <div className={`inline-block px-3 py-1 text-sm font-semibold rounded-full text-white ${color}`}>
                {rating}
            </div>
        </div>
    );
}

export default Gauge;