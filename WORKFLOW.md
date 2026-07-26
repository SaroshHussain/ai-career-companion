# AI Career Companion Development Workflow

This document describes the development workflow used while building the **AI Career Companion Landing Page**. During this assignment, the landing page was implemented twice using two different prompting approaches to evaluate how prompt quality affects code quality, maintainability, and review effort.

---

# Objective

Implement the **Landing Page** for the AI Career Companion in two separate branches:

- **Round One:** Use a single vague prompt and accept the generated output with minimal changes.
- **Round Two:** Use a detailed prompt including project context, file references, design constraints, reusable component requirements, expected behavior, and a verification step.

The goal was to compare both implementations and identify how prompt engineering improves AI-assisted software development.

---

# Round One — Vague Prompt

The first implementation used a simple prompt requesting a landing page for the AI Career Companion without providing detailed project context or constraints.

The generated page contained the basic sections, including:

- Hero Section
- Features
- Call-to-Action
- Footer

Although functional, several issues became apparent during review:

- Components were duplicated instead of reused.
- Folder structure did not fully follow the project architecture.
- Inconsistent spacing and typography.
- Styling differed from the existing design system.
- Responsiveness required manual fixes.
- Some sections lacked polish and consistency.

Overall, the implementation worked but required significant cleanup before it matched production-quality standards.

---

# Round Two — Precise Prompt

The second implementation used a detailed prompt that included:

- References to the existing project structure.
- Folder locations for reusable components.
- Existing design system guidelines.
- Tailwind CSS conventions.
- Color palette and typography hierarchy.
- Responsive design requirements.
- Accessibility expectations.
- Verification instructions to build and test the application.

The generated implementation integrated naturally into the existing project.

It successfully reused existing components, followed the established folder structure, maintained consistent spacing and typography, and required only minor refinements before completion.

---

# Correctness

The precise prompt produced significantly more accurate results.

The generated code:

- Followed the existing architecture.
- Reused components instead of duplicating them.
- Matched the requested landing page layout.
- Integrated cleanly with the existing project.
- Required minimal manual fixes.

The vague implementation required considerably more corrections before it was suitable for production.

---

# Accessibility

The second implementation followed better accessibility practices by including:

- Semantic HTML elements.
- Proper heading hierarchy.
- Accessible button labels.
- Keyboard-friendly navigation.
- Readable spacing and typography.
- Responsive layouts for different screen sizes.

These improvements created a more user-friendly and inclusive interface.

---

# Edge Cases

The detailed prompt encouraged handling several edge cases, including:

- Mobile, tablet, and desktop responsiveness.
- Long text within cards and sections.
- Different screen widths.
- Consistent alignment regardless of content length.
- Graceful layout behavior on smaller devices.

The vague implementation handled these cases less consistently and required manual adjustments.

---

# Review Effort

The difference in review effort between the two implementations was substantial.

### Vague Prompt

The review focused on:

- Refactoring duplicated components.
- Fixing inconsistent styling.
- Improving responsiveness.
- Aligning the implementation with the design system.
- Cleaning up the project structure.

### Precise Prompt

The review mainly involved:

- Verifying responsiveness.
- Checking visual consistency.
- Running the build process.
- Confirming accessibility.
- Performing minor UI refinements.

Because the implementation already followed the project conventions, far less manual work was required.

---

# Lessons Learned

This exercise demonstrated that prompt quality has a direct impact on development quality.

Providing detailed project context, architectural constraints, reusable component guidelines, expected behavior, and verification requirements enables AI to generate cleaner, more maintainable, and production-ready code.

Instead of relying on the model to infer project conventions, explicitly describing those conventions produces better results and reduces review time.

---

# Standard Development Workflow

For future development of the AI Career Companion, the following workflow will be followed:

## 1. Understand

Before writing code:

- Read the project documentation.
- Understand the folder structure.
- Review existing components.
- Follow the project's design system.
- Identify reusable code before creating new components.

---

## 2. Plan

Before implementation:

- Break the task into smaller steps.
- Identify reusable UI components.
- Decide where files should be placed.
- Consider responsive behavior and accessibility.
- Avoid unnecessary complexity.

---

## 3. Build

During implementation:

- Follow the existing folder structure.
- Create reusable React components.
- Keep components focused on a single responsibility.
- Reuse existing UI whenever possible.
- Maintain consistent styling using Tailwind CSS.
- Follow the project's spacing, typography, and color system.

---

## 4. Verify

Before completing the task:

- Test responsiveness.
- Check accessibility.
- Remove unused code.
- Remove unused imports.
- Verify there are no console errors.
- Ensure consistent spacing and typography.

Run:

```bash
npm run dev
npm run build
```

The project should build successfully before committing changes.

---

## AI Mistakes Encountered

While generating the landing page, the AI made several mistakes that required manual review and correction:

- Created duplicate components instead of reusing existing ones.
- Ignored the project's folder structure in some places.
- Used inconsistent spacing, typography, and styling compared to the design system.
- Added unnecessary code that increased complexity.
- Missed responsive adjustments for certain screen sizes.
- Did not fully follow the existing color palette and UI conventions.
- Generated some hardcoded content instead of extracting reusable data.
- Included unused imports and redundant code.
- Required manual cleanup to match the project's coding standards.

These issues were much more common when using the vague prompt. The precise prompt, which inclugit ded project context, constraints, file references, and verification steps, produced cleaner, more maintainable code and significantly reduced the amount of manual review required.

# Conclusion

The comparison between vague and precise prompting clearly demonstrated that detailed prompts produce higher-quality implementations with fewer revisions. Clear instructions regarding architecture, reusable components, design conventions, responsiveness, accessibility, and verification significantly reduce review effort while improving correctness and maintainability.

Going forward, I will follow the **Understand → Plan → Build → Verify** workflow whenever using AI-assisted development to ensure every contribution moves the AI Career Companion closer to a production-ready application.