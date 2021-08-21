import React, { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { IoCheckmark, IoChevronDownOutline } from 'react-icons/io5'
import { Language, runnerModule } from '../module/runner'

export default function LanguageSelector() {
  const [langauge, { setLanguage }] = runnerModule.use(
    (state) => state.language
  )

  return (
    <div className="w-36 z-10">
      <Listbox value={langauge} onChange={setLanguage}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full py-1 pl-3 pr-10 rounded-lg shadow-sm cursor-pointer text-left border-gray-200 border focus:outline-none text-sm">
            <span className="block truncate">{langauge}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <IoChevronDownOutline
                className="w-4 h-4 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {Object.values(Language).map((lang) => (
                <Listbox.Option
                  key={lang}
                  value={lang}
                  className={({ active }) =>
                    `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
                          cursor-pointer select-none relative py-2 pl-10 pr-4`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`${
                          selected ? 'font-medium' : 'font-normal'
                        } block truncate`}
                      >
                        {lang}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}
