package com.careerspherex.jdbc;

public class Main {

    public static void main(String[] args) {

        Skill crud = new Skill();

        // CREATE
        crud.createSkill("Java", "Advanced");

        // READ
        System.out.println("\nAll Skills:");
        crud.readSkills();

        // UPDATE
        crud.updateSkill(1, "Java", "Expert");

        // READ
        System.out.println("\nAfter Update:");
        crud.readSkills();

        // DELETE
        crud.deleteSkill(1);

        // READ
        System.out.println("\nAfter Delete:");
        crud.readSkills();
    }
}