import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const revalidate = 0

export default async function WindowsDeploymentGuidePage() {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/sign-in?redirect=/admin/windows-deployment")
  }

  // Check if user is admin
  const { data: userRole } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).single()

  if (!userRole || userRole.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Windows Server Deployment Guide</h1>
          <p className="text-gray-600">Step-by-step instructions for deploying this application on Windows Server</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prerequisites</CardTitle>
              <CardDescription>What you'll need before deploying</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Windows Server 2019 or newer</li>
                <li>Node.js 18.x or newer installed</li>
                <li>Git installed</li>
                <li>Internet Information Services (IIS) enabled</li>
                <li>URL Rewrite Module for IIS</li>
                <li>iisnode module installed</li>
                <li>Supabase account with project set up</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 1: Clone and Build the Application</CardTitle>
              <CardDescription>Prepare the application for deployment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <p className="font-medium">Clone the repository</p>
                  <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
                    <code>git clone https://github.com/yourusername/tech-rental-landing-page.git</code>
                  </pre>
                </li>
                <li>
                  <p className="font-medium">Navigate to the project directory</p>
                  <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
                    <code>cd tech-rental-landing-page</code>
                  </pre>
                </li>
                <li>
                  <p className="font-medium">Install dependencies</p>
                  <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
                    <code>npm install</code>
                  </pre>
                </li>
                <li>
                  <p className="font-medium">Create a .env.local file with your Supabase credentials</p>
                  <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
                    <code>
                      NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
                      <br />
                      NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
                      <br />
                      PORT=3000
                    </code>
                  </pre>
                </li>
                <li>
                  <p className="font-medium">Build the application</p>
                  <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
                    <code>npm run build</code>
                  </pre>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 2: Set Up IIS</CardTitle>
              <CardDescription>Configure IIS to host the Next.js application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <p className="font-medium">Install iisnode</p>
                  <p>
                    Download and install iisnode from{" "}
                    <a
                      href="https://github.com/Azure/iisnode/releases"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  </p>
                </li>
                <li>
                  <p className="font-medium">Create a new website in IIS</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Open IIS Manager</li>
                    <li>Right-click on "Sites" and select "Add Website"</li>
                    <li>Enter a site name (e.g., "TechRentalApp")</li>
                    <li>Set the physical path to your project directory</li>
                    <li>Choose a port (e.g., 80) or configure a hostname</li>
                    <li>Click "OK" to create the website</li>
                  </ul>
                </li>
                <li>
                  <p className="font-medium">Ensure web.config and server.js files are in your project root</p>
                  <p>
                    These files should already be in your project. They handle the integration between IIS and Next.js.
                  </p>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 3: Configure Environment Variables</CardTitle>
              <CardDescription>Set up environment variables in Windows Server</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <p className="font-medium">Set environment variables in IIS</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Open IIS Manager</li>
                    <li>Select your website</li>
                    <li>Double-click on "Application Settings"</li>
                    <li>
                      Add your Supabase environment variables:
                      <ul className="list-disc pl-5">
                        <li>NEXT_PUBLIC_SUPABASE_URL</li>
                        <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                        <li>PORT (set to 3000 or your preferred port)</li>
                      </ul>
                    </li>
                    <li>Set NODE_ENV to "production"</li>
                  </ul>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 4: Start the Application</CardTitle>
              <CardDescription>Run the application on Windows Server</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <p className="font-medium">Restart the IIS website</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>In IIS Manager, right-click on your website</li>
                    <li>Select "Restart"</li>
                  </ul>
                </li>
                <li>
                  <p className="font-medium">Test the application</p>
                  <p>Open a web browser and navigate to your server's IP address or hostname</p>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
              <CardDescription>Common issues and solutions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-5 space-y-4">
                <li>
                  <p className="font-medium">Application doesn't start</p>
                  <ul className="list-disc pl-5">
                    <li>Check IIS logs in %SystemDrive%\inetpub\logs\LogFiles</li>
                    <li>Check iisnode logs in your application directory</li>
                    <li>Verify Node.js is installed correctly and in the system PATH</li>
                  </ul>
                </li>
                <li>
                  <p className="font-medium">404 errors</p>
                  <ul className="list-disc pl-5">
                    <li>Verify URL Rewrite Module is installed</li>
                    <li>Check web.config for correct rewrite rules</li>
                  </ul>
                </li>
                <li>
                  <p className="font-medium">Database connection issues</p>
                  <ul className="list-disc pl-5">
                    <li>Verify environment variables are set correctly</li>
                    <li>Check if the server can reach Supabase (no firewall blocking)</li>
                  </ul>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
