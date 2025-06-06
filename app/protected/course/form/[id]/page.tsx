"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import FormSection from "@/components/forms/FormSection";

export default function EditCourseForm({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Individual state variables
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [organizedBy, setOrganizedBy] = useState("");
  const [applicationStartDate, setApplicationStartDate] = useState("");
  const [applicationEndDate, setApplicationEndDate] = useState("");
  const [courseStartDate, setCourseStartDate] = useState("");
  const [courseEndDate, setCourseEndDate] = useState("");
  const [eligibilityFrom, setEligibilityFrom] = useState("");
  const [eligibilityTo, setEligibilityTo] = useState("");
  const [referenceLink, setReferenceLink] = useState("");
  const [requirements, setRequirements] = useState([""]);
  const [courseTags, setCourseTags] = useState([""]);


  const formatDate = (dateStr: string | undefined | null): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; // ✅ format for input[type="date"]
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${resolvedParams.id}`);
        if (!res.ok) throw new Error("Failed to fetch course data");
        const data = await res.json();
        console.log(data);

        setName(data.name || "");
        setDescription(data.description || "");
        setOrganizedBy(data.organized_by || "");
        setApplicationStartDate(formatDate(data.application_start_date));
        setApplicationEndDate(formatDate(data.application_end_date));
        setCourseStartDate(formatDate(data.course_start_date));
        setCourseEndDate(formatDate(data.course_end_date));
        setEligibilityFrom(data.eligibility_from || "");
        setEligibilityTo(data.eligibility_to || "");
        setReferenceLink(data.reference_link || "");
        setRequirements(data.requirements || [""]);
        setCourseTags(data.course_tags || [""]);
        console.log("test", organizedBy);
      } catch (err) {
        setError("Failed to load course. Try again.");
        console.error(err);
      }
    };

    fetchCourse();
  }, [resolvedParams.id]);

  // Requirement handlers
  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length === 1) return; // keep at least one input
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  // CourseTags handlers
  const handleTagChange = (index: number, value: string) => {
    const newTags = [...courseTags];
    newTags[index] = value;
    setCourseTags(newTags);
  };

  const addTag = () => {
    setCourseTags([...courseTags, ""]);
  };

  const removeTag = (index: number) => {
    if (courseTags.length === 1) return; // keep at least one input
    setCourseTags(courseTags.filter((_, i) => i !== index));
  };


  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const updatedCourse = {
        name: formData.get("name"),
        description: formData.get("description"),
        organizedBy,
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


      const res = await fetch(`/api/courses/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCourse),
      });
      console.log("Submitted Course Data:", updatedCourse);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Update failed");
      }

      router.push("/protected/course/report");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [isExternal, setIsExternal] = useState(false);

  useEffect(() => {
    const handleSelect = () => {
      if (organizedBy !== "AIM") {
        setIsExternal(true);

      } else {
        setIsExternal(false);
      }
    };
    handleSelect();
  }, [organizedBy]);


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
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Edit course form</h1>
          <p className="text-gray-600">Update the course form below</p>
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

          <FormSection title="Basic Information">

            <div className="rounded-2xl pb-10 border border-gray-200 bg-white/70 shadow p-6 space-y-6">
              <h3 className="text-2xl font-semibold text-indigo-600 border-b pb-2">Basic Information</h3>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Course Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  rows={4}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none"
                  required
                />
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
                  <label htmlFor="applicationStartDate" className="block text-sm font-medium text-gray-700">Application Start Date</label>
                  <input
                    type="date"
                    id="applicationStartDate"
                    name="applicationStartDate"
                    value={applicationStartDate}
                    onChange={e => setApplicationStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="applicationEndDate" className="block text-sm font-medium text-gray-700">Application End Date</label>
                  <input
                    type="date"
                    id="applicationEndDate"
                    name="applicationEndDate"
                    value={applicationEndDate}
                    onChange={e => setApplicationEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label htmlFor="courseStartDate" className="block text-sm font-medium text-gray-700">Course Start Date</label>
                  <input
                    type="date"
                    id="courseStartDate"
                    name="courseStartDate"
                    value={courseStartDate}
                    onChange={e => setCourseStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="courseEndDate" className="block text-sm font-medium text-gray-700">Course End Date</label>
                  <input
                    type="date"
                    id="courseEndDate"
                    name="courseEndDate"
                    value={courseEndDate}
                    onChange={e => setCourseEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    required
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
                  <label htmlFor="eligibilityFrom" className="block mb-2 text-sm font-medium text-gray-700">
                    Eligibility From
                  </label>
                  <select
                    id="eligibilityFrom"
                    name="eligibilityFrom"
                    value={eligibilityFrom}
                    onChange={(e) => setEligibilityFrom(e.target.value)}
                    required
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
                  <label htmlFor="eligibilityTo" className="block mb-2 text-sm font-medium text-gray-700">
                    Eligibility To
                  </label>
                  <select
                    id="eligibilityTo"
                    name="eligibilityTo"
                    value={eligibilityTo}
                    onChange={(e) => setEligibilityTo(e.target.value)}
                    required
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



          <FormSection title="Requirements & Tags">
            <div className="rounded-2xl border border-gray-200 bg-white/70 shadow p-6">
              <h3 className="text-2xl font-semibold text-indigo-600 border-b pb-2 mb-6">Additional Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

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

                {/* Course Tags Section */}
                <div className="">
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

          <FormSection title="Reference">
            <div>
              <label htmlFor="referenceLink" className="block text-sm font-medium text-gray-700">Reference Link</label>
              <input
                type="url"
                id="referenceLink"
                name="referenceLink"
                value={referenceLink}
                onChange={e => setReferenceLink(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              />
            </div>
          </FormSection>


          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Update Course
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
