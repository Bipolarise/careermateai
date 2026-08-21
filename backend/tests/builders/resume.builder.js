// Test data builder for the Resume model (fluent/chainable API)

export class ResumeBuilder {
  constructor() {
    this.data = {
      title: 'Frontend Developer Resume',
      name: 'Jane Doe',
      address: '123 Main St, Springfield',
      experiences: '3 years as a Frontend Developer at Acme Inc.',
      skills: 'JavaScript, React, CSS',
      phone: '555-123-4567',
    };
  }

  withTitle(title) {
    this.data.title = title;
    return this;
  }

  withName(name) {
    this.data.name = name;
    return this;
  }

  withAddress(address) {
    this.data.address = address;
    return this;
  }

  withExperiences(experiences) {
    this.data.experiences = experiences;
    return this;
  }

  withSkills(skills) {
    this.data.skills = skills;
    return this;
  }

  withPhone(phone) {
    this.data.phone = phone;
    return this;
  }

  build() {
    return { ...this.data };
  }
}
