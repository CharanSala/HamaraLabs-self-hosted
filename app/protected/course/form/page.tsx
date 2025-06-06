"use client";

import { useState } from "react";
import React, { ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import FormSection from "@/components/forms/FormSection";
import { useRouter } from "next/navigation";


export default function CourseRegistrationForm() {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizedBy, setOrganizedBy] = useState("");
  const [requirements, setRequirements] = useState([""]);
  const [courseTags, setCourseTags] = useState([""]);

 const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const courseData = {
        name: formData.get("name"),
        description:formData.get("description"),
        organized_by: organizedBy,
        application_start_date: formData.get("applicationStartDate"),
        application_end_date: formData.get("applicationEndDate"),
        course_start_date: formData.get("courseStartDate"),
        course_end_date: formData.get("courseEndDate"),
        eligibility_from: formData.get("eligibilityFrom"),
        eligibility_to: formData.get("eligibilityTo"),
        reference_link: formData.get("referenceLink"),
        requirements,
        course_tags: courseTags,
      };

      // API submission can be added here

      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });
       console.log("Submitted Course Data:", courseData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit the form");
      }
       router.push("/protected/course/report");

    }
    catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleRequirementChange = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const removeRequirement = (index: number) => {
    const updated = requirements.filter((_, i) => i !== index);
    setRequirements(updated);
  };

  const handleTagChange = (index: number, value: string) => {
    const updated = [...courseTags];
    updated[index] = value;
    setCourseTags(updated);
  };

  const addTag = () => {
    setCourseTags([...courseTags, ""]);
  };

  const removeTag = (index: number) => {
    const updated = courseTags.filter((_, i) => i !== index);
    setCourseTags(updated);
  };

    const [isExternal, setIsExternal] = useState(false);



const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
  const val = e.target.value;
  if (val === "External") {
    setIsExternal(true);
    setOrganizedBy(""); // reset to let user type
  } else {
    setIsExternal(false);
    setOrganizedBy(val);
  }
};

  return (

    <div className="flex items-center justify-center w-screen min-h-screen bg-slate-400">
      <div className="m-10 w-full max-w-3xl p-8 bg-white bg-opacity-70 backdrop-blur-md rounded-2xl shadow-2xl">
        <div className="mb-3 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Course Registration</h1>
          <p className="text-gray-600">Fill out the form below to register your course</p>
        </div>


        {error && (
          <div className="bg-red-50 flex gap-3 items-center text-red-500 p-4 rounded-md mb-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-sm">
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="space-y-8 text-black"
        >

          {/* Basic Info */}
          <FormSection title="Basic Information">
            <div className="rounded-2xl pb-10 border border-gray-200 bg-white/70 shadow p-6 space-y-6">
              <h3 className="text-2xl font-semibold text-indigo-600 border-b pb-2">Basic Information</h3>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Course Name</label>
                <input
                  type="text"
                  name="name"
                
               
                  required
                  placeholder="Enter course name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                <textarea
                
                  name="description"
                 
                  required
                  rows={4}
                  placeholder="Enter description"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Organized By</label>

                <select
                  value={isExternal ? "External" : organizedBy}
                  onChange={handleSelectChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                >
                  <option value="">Select</option>
                  <option value="AIM">AIM</option>
                  <option value="External">
                    External
                  </option>
                </select>

                {isExternal && (
                  <input
                    type="text"
                   
                    value={organizedBy}
                    onChange={(e) => setOrganizedBy(e.target.value)}
                    placeholder="Enter external organizer name"
                    className="w-full  px-4 py-3 border border-gray-300 rounded-xl"
                    required
                  />
                )}
              </div>
           


              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Application Start Date</label>
                  <input
                    type="date"
                     name="applicationStartDate"
                  
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Application End Date</label>
                  <input
                    type="date"
                     name="applicationEndDate"
                   
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Course Start Date</label>
                  <input
                    type="date"
                    name="courseStartDate"
                  
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Course End Date</label>
                  <input
                    type="date"
                    name="courseEndDate"
                  
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </FormSection>

          {/* Eligibility */}
          <FormSection title="Eligibility">
            <div className="rounded-2xl border border-gray-200 bg-white/70 shadow p-6">
              <h3 className="text-2xl font-semibold text-indigo-600 border-b pb-2 mb-6">Eligibility</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-3">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">From</label>
                  <select
                  name="eligibilityFrom"
                   
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  >
                    <option value="">Select</option>
                    <option value="6th">6th</option>
                    <option value="7th">7th</option>
                    <option value="8th">8th</option>
                    <option value="9th">9th</option>
                    <option value="10th">10th</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">To</label>
                  <select
                  name="eligibilityTo"
                    
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  >
                    <option value="">Select</option>
                    <option value="6th">6th</option>
                    <option value="7th">7th</option>
                    <option value="8th">8th</option>
                    <option value="9th">9th</option>
                    <option value="10th">10th</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                  </select>
                </div>
              </div>
            </div>
          </FormSection>

          {/* Requirements Section */}
          {/* Requirements and Course Tags Section */}
          <FormSection title="Requirements & Tags">
            <div className="rounded-2xl border border-gray-200 bg-white/70 shadow p-6">
              <h3 className="text-2xl font-semibold text-indigo-600 border-b pb-2 mb-6">Additional Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Requirements */}
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Requirements</h4>
                  <div className="space-y-4">
                    {requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={requirement}
                          onChange={(e) => handleRequirementChange(index, e.target.value)}
                          placeholder={`Requirement ${index + 1}`}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                        />
                        {index === requirements.length - 1 && (
                          <button
                            type="button"
                            onClick={addRequirement}
                            className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-full font-bold"
                            aria-label="Add Requirement"
                          >
                            +
                          </button>
                        )}
                        {requirements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRequirement(index)}
                            className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full font-bold"
                            aria-label="Remove Requirement"
                          >
                            −
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Tags */}
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Course Tags</h4>
                  <div className="space-y-4">
                    {courseTags.map((tag, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) => handleTagChange(index, e.target.value)}
                          placeholder={`Tag ${index + 1}`}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                        />
                        {index === courseTags.length - 1 && (
                          <button
                            type="button"
                            onClick={addTag}
                            className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-full font-bold"
                            aria-label="Add Tag"
                          >
                            +
                          </button>
                        )}
                        {courseTags.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full font-bold"
                            aria-label="Remove Tag"
                          >
                            −
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FormSection>




          {/* Reference Link */}
          <FormSection title="Reference">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Reference Link</label>
              <input
                type="url"
                name="referenceLink"
              
                required
                placeholder="Enter reference link"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              />
            </div>
          </FormSection>

          {/* Submit */}
          <div className="flex justify-end w-full">
            <Button
              type="submit"
              isLoading={isLoading}
              size="lg"
              className="px-8 py-3 font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-indigo-700 transition"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
