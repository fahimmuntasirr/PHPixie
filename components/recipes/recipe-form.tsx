"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

interface Step {
  id: string;
  instruction: string;
}

export interface RecipeFormData {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  ingredients: Ingredient[];
  steps: Step[];
  tags: string[];
  imageUrl: string;
}

const CATEGORIES = [
  "Cakes",
  "Bread",
  "Muffins",
  "Cupcakes",
  "Cookies",
  "Pastries",
  "Pies",
  "Desserts",
  "Other",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard", "Expert"];

const UNITS = [
  "cups",
  "tbsp",
  "tsp",
  "oz",
  "g",
  "kg",
  "ml",
  "L",
  "pieces",
  "pinch",
  "to taste",
];

const emptyIngredient = (): Ingredient => ({
  id: crypto.randomUUID(),
  name: "",
  amount: "",
  unit: "cups",
});

const emptyStep = (): Step => ({
  id: crypto.randomUUID(),
  instruction: "",
});

interface RecipeFormProps {
  initialData?: RecipeFormData;
  onSubmit: (data: RecipeFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export default function RecipeForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Create Recipe",
  isSubmitting = false,
}: RecipeFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [difficulty, setDifficulty] = useState(initialData?.difficulty ?? "");
  const [prepTime, setPrepTime] = useState(initialData?.prepTime ?? "");
  const [cookTime, setCookTime] = useState(initialData?.cookTime ?? "");
  const [servings, setServings] = useState(initialData?.servings ?? "");
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialData?.ingredients ?? [emptyIngredient()]
  );
  const [steps, setSteps] = useState<Step[]>(
    initialData?.steps ?? [emptyStep()]
  );
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addIngredient = () =>
    setIngredients((prev) => [...prev, emptyIngredient()]);

  const removeIngredient = (id: string) =>
    setIngredients((prev) => prev.filter((i) => i.id !== id));

  const updateIngredient = (
    id: string,
    field: keyof Ingredient,
    value: string
  ) =>
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );

  const addStep = () => setSteps((prev) => [...prev, emptyStep()]);

  const removeStep = (id: string) =>
    setSteps((prev) => prev.filter((s) => s.id !== id));

  const updateStep = (id: string, instruction: string) =>
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, instruction } : s))
    );

  const moveStep = (index: number, direction: "up" | "down") => {
    const newSteps = [...steps];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    [newSteps[index], newSteps[targetIndex]] = [
      newSteps[targetIndex],
      newSteps[index],
    ];
    setSteps(newSteps);
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Recipe title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!category) newErrors.category = "Please select a category";
    if (!difficulty) newErrors.difficulty = "Please select a difficulty";
    if (!prepTime.trim()) newErrors.prepTime = "Prep time is required";
    if (!cookTime.trim()) newErrors.cookTime = "Cook time is required";
    if (!servings.trim()) newErrors.servings = "Servings is required";

    const validIngredients = ingredients.filter(
      (i) => i.name.trim() && i.amount.trim()
    );
    if (validIngredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required";
    }

    const validSteps = steps.filter((s) => s.instruction.trim());
    if (validSteps.length === 0) {
      newErrors.steps = "At least one step is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      prepTime: prepTime.trim(),
      cookTime: cookTime.trim(),
      servings: servings.trim(),
      ingredients: ingredients.filter((i) => i.name.trim() && i.amount.trim()),
      steps: steps.filter((s) => s.instruction.trim()),
      tags,
      imageUrl: imageUrl.trim(),
    });
  };

  const selectClasses =
    "h-9 w-full min-w-0 rounded-xl border border-gray-200 bg-white px-3 py-1 text-sm transition-all outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 disabled:pointer-events-none disabled:opacity-50 appearance-none cursor-pointer";

  const textareaClasses =
    "w-full min-w-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm transition-all outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 disabled:pointer-events-none disabled:opacity-50 resize-none";

  const inputClasses =
    "h-9 w-full min-w-0 rounded-xl border border-gray-200 bg-white px-3 py-1 text-sm transition-all outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 disabled:pointer-events-none disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section: Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-pink-50/80 to-transparent">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-pink-400 text-white flex items-center justify-center text-sm font-bold">
              1
            </span>
            Basic Information
          </h2>
        </div>
        <div className="p-4 sm:p-6 space-y-5">
          {/* Title */}
          <div>
            <label
              htmlFor="recipe-title"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Recipe Title <span className="text-pink-400">*</span>
            </label>
            <input
              id="recipe-title"
              type="text"
              placeholder="e.g., Classic Chocolate Chip Cookies"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClasses}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="recipe-description"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Description <span className="text-pink-400">*</span>
            </label>
            <textarea
              id="recipe-description"
              rows={3}
              placeholder="Describe your recipe — what makes it special?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={textareaClasses}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="recipe-image"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Image URL
            </label>
            <input
              id="recipe-image"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={inputClasses}
            />
            {imageUrl && (
              <div className="mt-3 w-32 h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Category + Difficulty row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="recipe-category"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Category <span className="text-pink-400">*</span>
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="recipe-category" className={selectClasses}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-red-500 mt-1">{errors.category}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="recipe-difficulty"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Difficulty <span className="text-pink-400">*</span>
              </label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="recipe-difficulty" className={selectClasses}>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.difficulty && (
                <p className="text-xs text-red-500 mt-1">{errors.difficulty}</p>
              )}
            </div>
          </div>

          {/* Time + Servings row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="recipe-prep-time"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Prep Time <span className="text-pink-400">*</span>
              </label>
              <input
                id="recipe-prep-time"
                type="text"
                placeholder="e.g., 20 mins"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className={inputClasses}
              />
              {errors.prepTime && (
                <p className="text-xs text-red-500 mt-1">{errors.prepTime}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="recipe-cook-time"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Cook Time <span className="text-pink-400">*</span>
              </label>
              <input
                id="recipe-cook-time"
                type="text"
                placeholder="e.g., 45 mins"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                className={inputClasses}
              />
              {errors.cookTime && (
                <p className="text-xs text-red-500 mt-1">{errors.cookTime}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="recipe-servings"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Servings <span className="text-pink-400">*</span>
              </label>
              <input
                id="recipe-servings"
                type="text"
                placeholder="e.g., 12"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className={inputClasses}
              />
              {errors.servings && (
                <p className="text-xs text-red-500 mt-1">{errors.servings}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section: Ingredients */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50/80 to-transparent">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center text-sm font-bold">
              2
            </span>
            Ingredients
          </h2>
        </div>
        <div className="p-4 sm:p-6 space-y-3">
          {errors.ingredients && (
            <p className="text-xs text-red-500">{errors.ingredients}</p>
          )}
          {ingredients.map((ingredient, index) => (
            <div
              key={ingredient.id}
              className="flex items-start gap-2 group animate-in fade-in duration-200"
            >
              <span className="w-6 h-9 flex items-center justify-center text-xs text-gray-400 font-medium shrink-0">
                {index + 1}
              </span>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-[1fr_80px_100px] gap-2">
                <input
                  type="text"
                  placeholder="Ingredient name"
                  value={ingredient.name}
                  onChange={(e) =>
                    updateIngredient(ingredient.id, "name", e.target.value)
                  }
                  className={`${inputClasses} col-span-2 sm:col-span-1`}
                />
                <input
                  type="text"
                  placeholder="Amount"
                  value={ingredient.amount}
                  onChange={(e) =>
                    updateIngredient(ingredient.id, "amount", e.target.value)
                  }
                  className={inputClasses}
                />
                <Select
                  value={ingredient.unit}
                  onValueChange={(value) =>
                    updateIngredient(ingredient.id, "unit", value)
                  }
                >
                  <SelectTrigger className={selectClasses}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <button
                type="button"
                onClick={() => removeIngredient(ingredient.id)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Remove ingredient"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="flex items-center gap-2 text-sm text-pink-400 font-medium hover:text-pink-500 transition-colors pt-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Ingredient
          </button>
        </div>
      </div>

      {/* Section: Instructions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50/80 to-transparent">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">
              3
            </span>
            Instructions
          </h2>
        </div>
        <div className="p-4 sm:p-6 space-y-3">
          {errors.steps && (
            <p className="text-xs text-red-500">{errors.steps}</p>
          )}
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-start gap-2 group animate-in fade-in duration-200"
            >
              <div className="flex flex-col items-center gap-0.5 shrink-0 pt-2">
                <button
                  type="button"
                  onClick={() => moveStep(index, "up")}
                  disabled={index === 0}
                  className="w-5 h-5 flex items-center justify-center rounded text-gray-300 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Move step up"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => moveStep(index, "down")}
                  disabled={index === steps.length - 1}
                  className="w-5 h-5 flex items-center justify-center rounded text-gray-300 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Move step down"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <textarea
                rows={2}
                placeholder={`Step ${index + 1}: Describe what to do...`}
                value={step.instruction}
                onChange={(e) => updateStep(step.id, e.target.value)}
                className={`${textareaClasses} flex-1`}
              />
              <button
                type="button"
                onClick={() => removeStep(step.id)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0 sm:opacity-0 sm:group-hover:opacity-100 mt-1"
                aria-label="Remove step"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="flex items-center gap-2 text-sm text-emerald-500 font-medium hover:text-emerald-600 transition-colors pt-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Step
          </button>
        </div>
      </div>

      {/* Section: Tags */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50/80 to-transparent">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center text-sm font-bold">
              4
            </span>
            Tags
          </h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Add a tag (e.g., gluten-free)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className={`${inputClasses} flex-1`}
            />
            <Button
              type="button"
              onClick={addTag}
              className="bg-violet-500 hover:bg-violet-600 text-white rounded-xl px-4 h-9 text-sm font-medium border-none"
            >
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-medium border border-violet-200"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-violet-200 transition-colors"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl px-6 h-10 text-sm font-medium w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-pink-400 hover:bg-pink-500 text-white rounded-xl px-8 h-10 text-sm font-semibold shadow-lg shadow-pink-200/50 border-none disabled:opacity-50 w-full sm:w-auto"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Saving...
            </span>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
