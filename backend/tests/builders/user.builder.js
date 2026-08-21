// Test data builder for the    Resume model (fluent/chainable API)

export class UserBuilder {
  constructor() {
    this.data = {
      email: 'jane.doe@example.com',
      name: 'Jane Doe',
      password: 'password123',
      field: '3 years as a Frontend Developer at Acme Inc.',
      goal: 'JavaScript, React, CSS',
      token: '',
    };
  }

  withEmail(email) {
    this.data.email = email;
    return this;
  }

  withFullName(fullName) {
    this.data.name = fullName;
    return this;
  }

  withPassword(password) {
    this.data.password = password;
    return this;
  }

  withField(field) {
    this.data.field = field;
    return this;
  }

  build() {
    return { ...this.data };
  }
}
