import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ADJUSTMENT_FACTORS } from '@/constants/adjustmentFactors';

export default function AdjustmentFactorModal({
  isOpen,
  onClose,
  onSubmit,
  initialFactors = {},
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const adjustmentFactors = Object.keys(ADJUSTMENT_FACTORS).map((key) => ({
      adjustmentFactorType: key,
      adjustmentFactorValue: formData.get(key),
    }));
    onSubmit({ adjustmentFactors });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-semibold leading-6 text-gray-900 mb-6 pb-4 border-b"
                >
                  보정계수 설정
                </Dialog.Title>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-8">
                    {Object.entries(ADJUSTMENT_FACTORS).map(([key, factor]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-base font-medium text-gray-900 mb-3">
                          {factor.title}
                        </label>
                        <select
                          name={key}
                          defaultValue={
                            initialFactors[key] || factor.options[0].value
                          }
                          className="block w-full px-4 py-3 rounded-lg bg-white border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6"
                        >
                          {factor.options.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-4 border-t flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      적용
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
