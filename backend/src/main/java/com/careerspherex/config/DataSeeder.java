package com.careerspherex.config;

import com.careerspherex.entity.Skill;
import com.careerspherex.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * On a completely blank database, the skill catalog starts empty, which
 * leaves the frontend's "Add a skill" dropdown with nothing to choose
 * from. This seeds a small starter catalog exactly once — it checks
 * count() first, so it's a no-op on every run after the first.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final SkillRepository skillRepository;

    @Override
    public void run(String... args) {
        if (skillRepository.count() > 0) {
            return;
        }

        List<Skill> starterSkills = List.of(
                skill("Java", "Programming Language", "Object-oriented general-purpose language, widely used for backend systems."),
                skill("Spring Boot", "Framework", "Java framework for building production-ready web applications and APIs."),
                skill("React", "Framework", "JavaScript library for building user interfaces."),
                skill("JavaScript", "Programming Language", "Core language of the web, used for frontend and backend (Node.js) development."),
                skill("SQL", "Database", "Query language for working with relational databases like MySQL and PostgreSQL."),
                skill("Python", "Programming Language", "General-purpose language popular for data science, scripting, and backend work."),
                skill("Git", "Tools", "Version control system for tracking changes in source code."),
                skill("Docker", "DevOps", "Platform for building, shipping, and running applications in containers."),
                skill("System Design", "Concepts", "Designing scalable, reliable software architectures."),
                skill("REST APIs", "Concepts", "Designing and consuming HTTP APIs following REST conventions."),
                skill("HTML & CSS", "Frontend", "Markup and styling fundamentals for building web interfaces."),
                skill("Data Structures & Algorithms", "Concepts", "Core problem-solving skills used across technical interviews and system design."),
                skill("AWS", "Cloud", "Amazon's cloud platform for hosting and scaling applications."),
                skill("Communication", "Soft Skill", "Clearly conveying ideas, written and verbal, to technical and non-technical audiences."),
                skill("Project Management", "Soft Skill", "Planning, prioritizing, and delivering work across a team or timeline.")
        );

        skillRepository.saveAll(starterSkills);
    }

    private Skill skill(String name, String category, String description) {
        return Skill.builder()
                .skillName(name)
                .category(category)
                .description(description)
                .build();
    }
}
