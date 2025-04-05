import { AddSupabase } from "@/components/add-supabase"

export default function SetupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">SecureGov AI Setup</h1>
        <AddSupabase />
      </div>
    </div>
  )
}

