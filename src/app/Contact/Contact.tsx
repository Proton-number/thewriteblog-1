"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import React, { useState } from "react";
import emailjs from "@emailjs/browser";

import { toast } from "sonner";
function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target; // Get the id and value of the input field
    setFormData((prevData) => ({
      ...prevData, // Spread the previous state
      [id]: value, // Update the specific field
    }));
  };

  const formHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);

    try {
      const templateParams = {
        user_name: formData.name,
        user_email: formData.email,
        message: formData.message,

        title: "Contact Form Submission",
      };

      const response = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
      );

      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
    setFormData({
      name: "",
      email: "",
      message: "",
    });
    toast.success(
      "Your message has been sent successfully! Thank you for reaching out."
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-8 space-y-5 px-4 sm:px-8 md:px-12 lg:px-16">
      <h1 className="font-bold text-6xl ">Let&apos;s Talk!</h1>
      <p className="font-medium text-xl text-gray-600 max-w-2xl text-center">
        Got a project idea, want to collaborate, or just feel like saying hi?
        Drop a message below.
      </p>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm sm:max-w-xl lg:max-w-3xl px-2"
      >
        <Card className="shadow-lg">
          <form onSubmit={formHandler}>
            <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-7">
              <Label htmlFor="name" className="text-base sm:text-lg">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                className="text-base py-2"
                value={formData.name}
                onChange={handleChange}
              />
              <Label htmlFor="email" className="text-base sm:text-lg">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Your Email"
                className="text-base py-2"
                value={formData.email}
                onChange={handleChange}
              />
              <Label htmlFor="message" className="text-base sm:text-lg">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Tell me what's on your mind..."
                className="text-base py-2 min-h-[100px]"
                value={formData.message}
                onChange={handleChange}
              />
              <Button type="submit" className="cursor-pointer w-full sm:w-auto">
                Send Message
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

export default Contact;
