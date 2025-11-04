# Smart Recipe Planner

Smart Recipe Planner is a web application that helps users plan their meals and generate recipes using artificial intelligence.

## Features

*   **User Authentication:** Secure user registration, login, and logout functionality.
*   **Recipe Management:** Users can create, view, update, and delete their own recipes.
*   **AI-Powered Recipe Generation:** Generate new and creative recipes based on user prompts.
*   **Interactive Recipe Feed:** Browse a dynamic feed of recipes from all users.
*   **Modal Views:** View recipe details in a non-intrusive modal window for a seamless experience.
*   **Responsive Design:** A user-friendly interface that works on all devices.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **AI:** [Google Generative AI](https://ai.google.dev/)
*   **Authentication:** JWT (implemented using cookies)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v20 or later)
*   npm

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username/smart-recipe-planner-app.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```

### Running the Application

1.  Create a `.env.local` file in the root of the project and add the following environment variables:
    ```
    GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
    JWT_SECRET="YOUR_JWT_SECRET"
    ```
2.  Run the development server
    ```sh
    npm run dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Endpoints

The following API endpoints are available:

*   `POST /api/generate-recipe`: Generates a new recipe using AI.
*   `POST /api/login`: Logs in a user.
*   `POST /api/logout`: Logs out a user.
*   `GET /api/me`: Retrieves the currently logged-in user.
*   `GET /api/recipes`: Retrieves a list of all recipes.
*   `POST /api/recipes`: Creates a new recipe.
*   `GET /api/recipes/[id]`: Retrieves a single recipe by its ID.
*   `PUT /api/recipes/[id]`: Updates a recipe by its ID.
*   `DELETE /api/recipes/[id]`: Deletes a recipe by its ID.

## Project Structure

```
smart-recipe-planner-app/
├── app/
│   ├── api/                # API routes
│   │   ├── generate-recipe/
│   │   ├── login/
│   │   ├── logout/
│   │   ├── me/
│   │   └── recipes/
│   ├── @modal/             # Intercepted routes for modal views
│   ├── create-recipe/      # Page for creating new recipes
│   ├── edit-recipe/        # Page for editing existing recipes
│   ├── recipes/            # Pages for displaying recipes
│   ├── layout.jsx          # Root layout
│   └── page.jsx            # Home page
├── components/
│   ├── auth/               # Authentication-related components
│   ├── recipes/            # Recipe-related components
│   └── ui/                 # General UI components
├── context/
│   ├── AuthContext.jsx     # Context for managing authentication state
│   └── ToastContext.jsx    # Context for displaying toast notifications
├── hooks/
│   └── useApiClient.js     # Custom hook for making API requests
├── lib/
│   └── apiClient.js        # API client setup
└── ...
```

## Key Components

*   **`AuthForm`**: Handles both login and registration forms.
*   **`RecipeCard`**: Displays a summary of a recipe in the feed.
*   **`RecipeFeed`**: Fetches and displays a list of all recipes.
*   **`RecipeForm`**: A form for creating and editing recipes.
*   **`Modal`**: A reusable modal component for displaying content like recipe details.
*   **`Navbar`**: The main navigation bar for the application.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request