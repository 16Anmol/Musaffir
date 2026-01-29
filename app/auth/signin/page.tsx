"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { FirebaseError } from "firebase/app";
import { motion } from "framer-motion"
import Header from "@/components/header"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

// Firebase imports
import { initializeApp } from "firebase/app"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDexy6GrUFkMlr7ozDAYV3h6q6gfoUYqXM",
  authDomain: "login-form-55187.firebaseapp.com",
  projectId: "login-form-55187",
  storageBucket: "login-form-55187.firebasestorage.app",
  messagingSenderId: "847002798638",
  appId: "1:847002798638:web:29b60f4cbb3d738fef6dbf",
}

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [userFormData, setUserFormData] = useState({
    email: "",
    password: "",
  })
  const [organizerFormData, setOrganizerFormData] = useState({
    username: "",
    password: "",
  })
  const [signInMessage, setSignInMessage] = useState("")
  const [signUpMessage] = useState("")
  const [showSignUp, setShowSignUp] = useState(false)
  const [signUpFormData, setSignUpFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  })

  // Initialize Firebase
  useEffect(() => {
    initializeApp(firebaseConfig)
  }, [])

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleOrganizerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOrganizerFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignUpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignUpFormData((prev) => ({ ...prev, [name]: value }))
  }

  const showMessage = (message: string, setMessageFunc: React.Dispatch<React.SetStateAction<string>>) => {
    setMessageFunc(message)
    setTimeout(() => {
      setMessageFunc("")
    }, 5000)
  }

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, userFormData.email, userFormData.password)

      // Show success message
      showMessage("Login successful!", setSignInMessage)

      // Store user ID in localStorage
      localStorage.setItem("loggedInUserId", userCredential.user.uid)

      // Redirect to homepage
      window.location.href = "/"
    } catch (error) {
  if (error instanceof FirebaseError) {
    if (error.code === "auth/invalid-credential") {
      showMessage("Incorrect email or password", setSignInMessage);
    } else {
      showMessage("Account does not exist", setSignInMessage);
    }
  } else {
    showMessage("An unknown error occurred", setSignInMessage);
  }
}

  }

  const handleOrganizerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle organizer login
    showMessage("Organizer login not implemented yet", setSignInMessage)
  }

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Redirect to the external signup page
    window.location.href = "https://loginpage-sigma-three.vercel.app/index.html"
  }

  const toggleSignUpForm = () => {
    setShowSignUp(!showSignUp)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/placeholder.svg?height=800&width=1920" alt="Sign In Background" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-orange-900/80" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            {/* Welcome Content */}
            <motion.div
              className="text-white"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome Back to Musafir</h1>
              <p className="text-xl text-amber-100 mb-8">
                Sign in to access your travel dashboard, manage bookings, and discover new adventures.
              </p>
              <div className="space-y-4">
                <div className="flex items-center text-amber-200">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
                  <span>Access exclusive travel deals</span>
                </div>
                <div className="flex items-center text-amber-200">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
                  <span>Manage your bookings and preferences</span>
                </div>
                <div className="flex items-center text-amber-200">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
                  <span>Connect with fellow travelers</span>
                </div>
              </div>
            </motion.div>

            {/* Sign In Forms */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="border-2 border-amber-200 shadow-2xl bg-gradient-to-b from-white to-amber-50">
                <div className="p-6">
                  {/* Toggle Buttons */}
                  <div className="flex mb-6 bg-amber-100 rounded-lg p-1">
                    <Button
                      type="button"
                      variant={!showSignUp ? "default" : "ghost"}
                      className={`flex-1 ${
                        !showSignUp
                          ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                          : "text-amber-700 hover:bg-amber-200"
                      }`}
                      onClick={() => setShowSignUp(false)}
                    >
                      Sign In
                    </Button>
                    <Button
                      type="button"
                      variant={showSignUp ? "default" : "ghost"}
                      className={`flex-1 ${
                        showSignUp
                          ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                          : "text-amber-700 hover:bg-amber-200"
                      }`}
                      onClick={toggleSignUpForm}
                    >
                      Sign Up
                    </Button>
                  </div>

                  {!showSignUp ? (
                    <>
                      {/* User Sign In Form */}
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-amber-900 mb-4">User Login</h3>
                        <form onSubmit={handleUserSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-amber-800 mb-2">Email</label>
                            <Input
                              name="email"
                              type="email"
                              value={userFormData.email}
                              onChange={handleUserInputChange}
                              placeholder="your.email@example.com"
                              required
                              className="border-2 border-amber-200 focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-amber-800 mb-2">Password</label>
                            <div className="relative">
                              <Input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={userFormData.password}
                                onChange={handleUserInputChange}
                                placeholder="Enter your password"
                                required
                                className="pr-10 border-2 border-amber-200 focus:border-amber-500"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                              </Button>
                            </div>
                          </div>

                          {signInMessage && (
                            <div className="p-3 bg-amber-100 border border-amber-300 rounded text-amber-800 text-sm">
                              {signInMessage}
                            </div>
                          )}

                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 border-2 border-amber-500"
                          >
                            Sign In as User
                          </Button>
                        </form>
                      </div>

                      {/* Organizer Sign In Form */}
                      <div className="border-t border-amber-200 pt-6">
                        <h3 className="text-xl font-bold text-amber-900 mb-4">Organizer Login</h3>
                        <form onSubmit={handleOrganizerSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-amber-800 mb-2">Username</label>
                            <Input
                              name="username"
                              value={organizerFormData.username}
                              onChange={handleOrganizerInputChange}
                              placeholder="Organizer username"
                              required
                              className="border-2 border-amber-200 focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-amber-800 mb-2">Password</label>
                            <Input
                              name="password"
                              type="password"
                              value={organizerFormData.password}
                              onChange={handleOrganizerInputChange}
                              placeholder="Organizer password"
                              required
                              className="border-2 border-amber-200 focus:border-amber-500"
                            />
                          </div>

                          <Button
                            type="submit"
                            variant="outline"
                            className="w-full border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
                          >
                            Sign In as Organizer
                          </Button>
                        </form>
                      </div>
                    </>
                  ) : (
                    /* Sign Up Form */
                    <div>
                      <h3 className="text-xl font-bold text-amber-900 mb-4">Create Account</h3>
                      <form onSubmit={handleSignUpSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-amber-800 mb-2">First Name</label>
                            <Input
                              name="firstName"
                              value={signUpFormData.firstName}
                              onChange={handleSignUpInputChange}
                              placeholder="First name"
                              required
                              className="border-2 border-amber-200 focus:border-amber-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-amber-800 mb-2">Last Name</label>
                            <Input
                              name="lastName"
                              value={signUpFormData.lastName}
                              onChange={handleSignUpInputChange}
                              placeholder="Last name"
                              required
                              className="border-2 border-amber-200 focus:border-amber-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-amber-800 mb-2">Email</label>
                          <Input
                            name="email"
                            type="email"
                            value={signUpFormData.email}
                            onChange={handleSignUpInputChange}
                            placeholder="your.email@example.com"
                            required
                            className="border-2 border-amber-200 focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-amber-800 mb-2">Password</label>
                          <Input
                            name="password"
                            type="password"
                            value={signUpFormData.password}
                            onChange={handleSignUpInputChange}
                            placeholder="Create a password"
                            required
                            className="border-2 border-amber-200 focus:border-amber-500"
                          />
                        </div>

                        {signUpMessage && (
                          <div className="p-3 bg-amber-100 border border-amber-300 rounded text-amber-800 text-sm">
                            {signUpMessage}
                          </div>
                        )}

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 border-2 border-amber-500"
                        >
                          Create Account
                        </Button>
                      </form>
                    </div>
                  )}

                  <div className="mt-6 text-center">
                    <p className="text-sm text-amber-700">
                      {!showSignUp ? "Don&apos;t have an account? " : "Already have an account? "}
                      <button
                        type="button"
                        onClick={toggleSignUpForm}
                        className="text-amber-600 hover:text-amber-800 font-medium underline"
                      >
                        {!showSignUp ? "Sign up here" : "Sign in here"}
                      </button>
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
