'use client';

export default function ProcessMetrics({
  metrics,
  selectedFilter,
  onFilterChange,
}) {
  return (
    <div className="grid grid-cols-5 gap-6 mb-8">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className={`rounded-lg shadow-sm border ${
            selectedFilter === metric.id
              ? 'border-2 ' + metric.borderColor
              : 'border-gray-100'
          } ${metric.bgColor} hover:shadow-md transition-shadow cursor-pointer`}
          onClick={() => onFilterChange(metric.id)}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-lg font-semibold ${metric.textColor}`}>
                {metric.name}
              </span>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full bg-white/50 ${metric.textColor}`}
              >
                {metric.count}개
              </span>
            </div>
            <div className={`text-2xl font-bold ${metric.textColor}`}>
              {metric.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
