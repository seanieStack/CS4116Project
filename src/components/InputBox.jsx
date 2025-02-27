"use client"

export default function InputBox({type="text", placeholder}) {
    return (
        <div className="max-w-sm space-y-3">
            <input type={type}
                   className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none shadow dark:bg-[#333]"
                   placeholder={placeholder || ""}/>
        </div>
    )
}