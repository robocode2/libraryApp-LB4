# LeetCode Task List - 20.08.2023

## Tasks for Cybersecurity Module

1. Write integration tests for all routes and cases.
2. Write tests for schemas.
3. Explore penetration tests and other significant security measures.
4. Deploy the application.
5. Implement regular backup procedures.
6. Connect with Sequelize.
7. Check the threat model
8. Create own threat model
9. write commands in package json
10. User CRUD -- > Adding roles to handle Users and Book requests?
12. Consider changing Book to Movie or something ?
13. I haven't implemeneted session cookies or whatnot
14. for example findByName... I need to create repos for that, not base Repos. or do I ?
15. similarily, Orms or not ?
16. no roles yet either
17. a user with multiple entries, same email, same password
18. 10,000 book requests. 10,000 books with same title?. 10,000 entries?
19. Deleting books ?
20.

## Specific Issues and Solutions

### 1. User Sign-Up
   - User signup should not return the id and password.

   **Solution:**
   - Consider using domain users.

### 2. Duplicate Email Addresses
   - Two users with the same email address can still obtain a token.

   **Solution:**
   - Specify that no two users can share the same email address.

### 3. List Creation
   - List creation shouldn't return userId.

   **Solution:**
   - Investigate how to hide properties.

### General Functionality Checks

- Deleting books is working.
- Update list functionality.
- Handle cases when accessing a non-existing list.
- Consider the impact of adding an authorization provider.
- Check if a list exists before taking action.
- Handle entries with non-existing lists and books.
- Enforce uniqueness for usernames.
- Double-check against the books API.
- Connect Sequelize to the application.

## Larger Tasks - Security Considerations

### Security Measures
- Follow the STRIDE approach.
- Compile a list of common attacks.
- Implement security measures against various attacks.
- Add authorization middleware to protected routes.
- Implement input validation strategies.
- Use JWT tokens for authentication.
- Set up a logging system for security events.
- Mitigate information disclosure risks.

### Denial of Service (DOS)
- Implement measures to prevent DOS attacks.

## Capstone Project Considerations

- Capstone project without a backend.
- Define the scope of the capstone project.
- Explore creating a website that draws on other websites.
- Consider a backend-heavy project.
- Evaluate playing to your strengths or exploring new technologies.
- Reflect on the significance of the project - doesn't need to be groundbreaking.
- Consider focusing on a database that handles change requests.
- Assess the availability of specialists or alternatives for guidance (Telegram prof alternative).
