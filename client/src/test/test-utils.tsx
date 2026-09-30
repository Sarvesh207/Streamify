import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from '../store/slices/userSlice';

// Create a custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    preloadedState?: any;
    store?: ReturnType<typeof configureStore>;
}

export function renderWithProviders(
    ui: React.ReactElement,
    {
        preloadedState = {},
        store = configureStore({
            reducer: combineReducers({
                user: userReducer,
            }),
            preloadedState,
        }),
        ...renderOptions
    }: CustomRenderOptions = {}
) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        {children}
                    </BrowserRouter>
                </QueryClientProvider>
            </Provider>
        );
    }

    return {
        store,
        queryClient,
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Export the custom render as the default render
export { renderWithProviders as render };
