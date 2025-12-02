# Contributing to BIMS

Thank you for your interest in contributing to the Barangay Information Management System! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help each other learn and grow

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/bims.git
   cd bims
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/bims.git
   ```

## Development Workflow

### Before Starting

1. **Sync with upstream**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Making Changes

#### Backend Development

1. **Code Style**
   - Use 2-space indentation
   - Use descriptive variable names
   - Add JSDoc comments for functions
   - Keep functions focused and small

2. **File Structure**
   - Models: Database definitions in `src/models/`
   - Controllers: Business logic in `src/controllers/`
   - Routes: URL mappings in `src/routes/`
   - Use meaningful filenames

3. **Example Controller Function**:
   ```javascript
   /**
    * Get all residents with optional search
    * @param {Request} req - Express request object
    * @param {Response} res - Express response object
    */
   exports.listResidents = async (req, res) => {
     try {
       const { q, page = 1, pageSize = 50 } = req.query;
       // Implementation...
       res.json(result);
     } catch (err) {
       console.error(err);
       res.status(500).json({ message: 'Server error' });
     }
   };
   ```

#### Frontend Development

1. **Code Style**
   - Use 2-space indentation
   - Use descriptive component and variable names
   - Keep components focused and reusable
   - Add comments for complex logic

2. **Component Structure**
   ```jsx
   import React, { useState } from 'react';
   import PageHeader from './PageHeader';

   /**
    * ResidentList - Display list of residents
    * @component
    */
   export default function ResidentList() {
     const [residents, setResidents] = useState([]);
     // Implementation...
     return (
       <div>
         <PageHeader title="Residents" />
         {/* Content */}
       </div>
     );
   }
   ```

3. **Tailwind CSS Guidelines**
   - Use utility classes for styling
   - Avoid inline styles
   - Keep className readable
   - Use responsive classes (sm:, md:, lg:)

### Testing

1. **Backend Tests**
   ```bash
   cd backend
   npm test
   ```

2. **Write Tests**
   - Create test file in `__tests__` directory
   - Use Jest and Supertest
   - Test both success and error cases

3. **Test Example**:
   ```javascript
   describe('Resident Controller', () => {
     test('should list all residents', async () => {
       const response = await request(app).get('/api/residents');
       expect(response.status).toBe(200);
       expect(Array.isArray(response.body.rows)).toBe(true);
     });
   });
   ```

### Committing Changes

1. **Commit Messages**
   ```
   Type: Subject (50 chars or less)

   Body (optional, 72 chars wrapped)
   - Explain what and why, not how
   - Use present tense
   - Use bullet points for multiple changes
   ```

2. **Commit Types**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style (formatting, semicolons, etc.)
   - `refactor:` Code refactoring
   - `test:` Test-related changes
   - `chore:` Build, dependencies, etc.

3. **Examples**
   ```bash
   git commit -m "feat: add resident export to CSV functionality"
   git commit -m "fix: correct household search query filter"
   git commit -m "docs: update API documentation for certificates"
   ```

## Pull Request Process

1. **Push your changes**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to GitHub and create new PR
   - Use descriptive title
   - Fill in PR template completely

3. **PR Template**:
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] New feature
   - [ ] Bug fix
   - [ ] Documentation update
   - [ ] Breaking change

   ## How to Test
   Steps to verify the changes work

   ## Screenshots (if applicable)
   Add screenshots for UI changes

   ## Checklist
   - [ ] My code follows the style guidelines
   - [ ] I have performed a self-review
   - [ ] I have tested my changes
   - [ ] I have updated documentation
   - [ ] No new warnings have been generated
   ```

4. **Code Review**
   - Respond to feedback promptly
   - Make requested changes in new commits
   - Rebase if necessary

## Reporting Issues

1. **Use GitHub Issues**
2. **Issue Template**:
   ```markdown
   ## Description
   Clear description of the issue

   ## Steps to Reproduce
   1. Step one
   2. Step two
   3. Step three

   ## Expected Behavior
   What should happen

   ## Actual Behavior
   What actually happens

   ## Environment
   - OS: Windows/Mac/Linux
   - Browser: Chrome/Firefox/etc
   - Node version: 14/16/18

   ## Screenshots/Logs
   Attach relevant screenshots or error logs
   ```

## Project Structure Guidelines

### Adding a New Feature

1. **Backend**:
   - Create model in `src/models/`
   - Create controller in `src/controllers/`
   - Create routes in `src/routes/`
   - Add associations in `src/models/index.js`

2. **Frontend**:
   - Create page component in `src/pages/`
   - Create reusable components in `src/components/`
   - Add routes in `src/App.jsx`
   - Style with Tailwind CSS

3. **Documentation**:
   - Update README.md
   - Add API documentation
   - Include examples

## Performance Considerations

### Backend
- Optimize database queries
- Use pagination for large datasets
- Implement caching where appropriate
- Profile slow endpoints

### Frontend
- Lazy load components
- Memoize expensive computations
- Optimize re-renders
- Minimize bundle size

## Security Considerations

- **Never commit sensitive data** (.env files, passwords, API keys)
- Validate and sanitize all user inputs
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Use HTTPS in production
- Keep dependencies updated

## Documentation Standards

### Code Comments
```javascript
// Use single-line comments for brief explanations
// Multi-line explanations should be formatted like this

/**
 * JSDoc format for functions
 * @param {Type} paramName - Description
 * @returns {Type} Description of return value
 */
```

### README Sections
- What the project does
- How to install it
- How to use it
- How to contribute
- License information

## Useful Links

- [Node.js Documentation](https://nodejs.org/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Sequelize Docs](https://sequelize.org/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

## Questions or Need Help?

- Open an issue with question tag
- Check existing issues for similar questions
- Join our discussions/community
- Email: your-email@example.com

---

Thank you for contributing to BIMS! 🎉
