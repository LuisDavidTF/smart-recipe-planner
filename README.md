# Smart Recipe Planner

Smart Recipe Planner is a web application that helps users plan their meals and generate recipes using artificial intelligence.

## Features

*   User authentication (login, logout, registration)
*   Create, read, update, and delete recipes
*   Generate new recipes using AI
*   Browse a feed of recipes
*   View individual recipes
*   User-friendly and responsive interface

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
    git clone https://github.com/your_username/smart-recipe-planner.git
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
3.  Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

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
.
├── app/
│   ├── api/
│   │   ├── generate-recipe/
│   │   ├── login/
│   │   ├── logout/
│   │   ├── me/
│   │   └── recipes/
│   ├── (main)/
│   │   ├── create-recipe/
│   │   ├── edit-recipe/
│   │   ├── recipes/
│   │   └── ...
│   └── layout.js
├── components/
│   ├── auth/
│   ├── recipes/
│   └── ui/
├── context/
│   ├── AuthContext.js
│   └── ToastContext.js
├── hooks/
│   └── useApiClient.js
├── lib/
│   ├── apiClient.js
│   └── constants.js
├── public/
└── ...
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
