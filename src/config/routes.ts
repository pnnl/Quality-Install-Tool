const routes = {
    HOME: '/',
    APP_ROOT: '/app',
    NEW_PROJECT: '/app/new',
    EDIT_PROJECT: '/app/:projectId',
    SHOW_PROJECT: '/app/:projectId/workflows',
    INSTALLATIONS_LIST: '/app/:projectId/:workflowName',
    EDIT_INSTALLATION: '/app/:projectId/:workflowName/:installationId',
    DOWNLOAD_REMINDER: '/app/:projectId/download-reminder/:fromHome?',
    FAQS: '/app/faqs',
}

export default routes
