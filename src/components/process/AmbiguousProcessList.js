'use client';

export default function AmbiguousProcessList({
  processes,
  onEdit,
  editingProcess,
  onSave,
  onCancel,
  onChange,
  getMetricColors,
  getRequirementNumbers,
  onRequirementClick,
  metrics,
  getProcessNumber,
}) {
  if (!processes.length) return null;

  return (
    <div className="mb-8">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">
          모호한 단위 프로세스
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-yellow-100/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">
                  요구사항 ID 출처
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">
                  단위 프로세스명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">
                  분류
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-yellow-200">
              {processes.map((process) => (
                <tr key={process.id} className="hover:bg-yellow-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-800">
                    {getProcessNumber(process.id)}
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-yellow-800 cursor-pointer hover:text-blue-600"
                    onClick={() =>
                      onRequirementClick(process.requirementIdList)
                    }
                  >
                    {getRequirementNumbers(process.requirementIdList).join(
                      ', ',
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-yellow-800">
                    {editingProcess?.id === process.id ? (
                      <input
                        type="text"
                        value={editingProcess.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        className="w-full px-2 py-1 border border-yellow-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{process.name}</span>
                        <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          모호
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {editingProcess?.id === process.id ? (
                      <select
                        value={editingProcess.type}
                        onChange={(e) => onChange('type', e.target.value)}
                        className="px-2 py-1 border border-yellow-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        {metrics.map((metric) => (
                          <option key={metric.id} value={metric.id}>
                            {metric.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          getMetricColors(process.type).bg
                        } ${getMetricColors(process.type).text}`}
                      >
                        {process.type}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-800">
                    {editingProcess?.id === process.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={onSave}
                          className="text-green-600 hover:text-green-800"
                        >
                          저장
                        </button>
                        <button
                          onClick={onCancel}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onEdit(process)}
                        className="text-yellow-600 hover:text-yellow-800"
                        disabled={editingProcess !== null}
                      >
                        수정
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
