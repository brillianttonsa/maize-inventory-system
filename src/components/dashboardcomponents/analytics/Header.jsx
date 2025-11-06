import { RefreshCw } from "lucide-react"
export const Header = ({refreshData, loading}) => {
    return(
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold text-gray-900 mb-2`}>
              Analytics Dashboard
            </h1>
            <p className={"text-gray-600"}>Daily and overall maize business insights</p>
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
    )
}