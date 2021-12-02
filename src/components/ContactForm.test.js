import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm />)
});

test('renders the contact form header', ()=> {
	render(<ContactForm />)
    const header = screen.queryByText(/contact form/i);
		expect(header).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />)
		const firstField = screen.getByLabelText(/First Name*/i);
		userEvent.type(firstField, 'John');
		const firstError = screen.queryByText(/firstName must have at least 5 characters/i);
		expect(firstError).toBeInTheDocument();
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />)
		const button = screen.getByRole('button');
		userEvent.click(button);
		const firstError = screen.queryByText(/firstName must have at least 5 characters/i);
		expect(firstError).toBeInTheDocument();
		const lastError = screen.queryByText(/lastName is a required field./i);
		expect(lastError).toBeInTheDocument();
		const emailError = screen.queryByText(/email must be a valid email address./i);
		expect(emailError).toBeInTheDocument();
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />)
		const firstField = screen.getByLabelText(/First Name*/i);
		userEvent.type(firstField, 'Johnny');
		const lastField = screen.getByLabelText(/Last Name*/i);
		userEvent.type(lastField, 'Smith');
		const button = screen.getByRole('button');
		userEvent.click(button);
		await waitFor(()=> {
			const emailError = screen.queryByText(/email must be a valid email address./i);
			expect(emailError).toBeInTheDocument();
		});
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />)
		const emailField = screen.getByLabelText(/Email*/i);
		userEvent.type(emailField, 'John');
		const emailError = screen.queryByText(/email must be a valid email address./i);
		expect(emailError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />)
		const button = screen.getByRole('button');
		userEvent.click(button);
		await waitFor(()=> {
			const lastError = screen.queryByText(/lastName is a required field./i);
			expect(lastError).toBeInTheDocument();
		});
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />)
		const firstField = screen.getByLabelText(/First Name*/i);
		userEvent.type(firstField, 'Johnny');
		const lastField = screen.getByLabelText(/Last Name*/i);
		userEvent.type(lastField, 'Smith');
		const emailField = screen.getByLabelText(/Email*/i);
		userEvent.type(emailField, 'John@shojo.org');
		const button = screen.getByRole('button');
		userEvent.click(button);
		await waitFor(()=> {
			const message = screen.queryByText(/Message:/i);
			expect(message).not.toBeInTheDocument();
		});
});

test('renders all fields text when all fields are submitted.', async () => {
		render(<ContactForm />)
		const firstField = screen.getByLabelText(/First Name*/i);
		userEvent.type(firstField, 'Johnny');
		const lastField = screen.getByLabelText(/Last Name*/i);
		userEvent.type(lastField, 'Smith');
		const emailField = screen.getByLabelText(/Email*/i);
		userEvent.type(emailField, 'John@shojo.org');
		const messageField = screen.getByLabelText(/Message/i);
		userEvent.type(messageField, 'Sucks to be you');
		const button = screen.getByRole('button');
		userEvent.click(button);
		await waitFor(()=> {
			const first = screen.queryByText(/First Name:/i);
			expect(first).toBeInTheDocument();
			const last = screen.queryByText(/Last Name:/i);
			expect(last).toBeInTheDocument();
			const email = screen.queryByText(/Email:/i);
			expect(email).toBeInTheDocument();
			const message = screen.queryByText(/Message:/i);
			expect(message).toBeInTheDocument();
		});
});