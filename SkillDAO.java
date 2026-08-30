package com.careerspherex.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class SkillDAO {

    // CREATE
    public void addSkill(String name, String level) {

        String sql = "INSERT INTO skills(name, level) VALUES (?, ?)";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setString(1, name);
            ps.setString(2, level);

            ps.executeUpdate();

            System.out.println("Skill added successfully!");

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    // READ
    public void getSkills() {

        String sql = "SELECT * FROM skills";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();

            System.out.println("ID | Name | Level");
            System.out.println("-----------------------");

            while (rs.next()) {

                int id = rs.getInt("id");
                String name = rs.getString("name");
                String level = rs.getString("level");

                System.out.println(id + " | " + name + " | " + level);
            }

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    // UPDATE
    public void updateSkill(int id, String name, String level) {

        String sql =
                "UPDATE skills SET name=?, level=? WHERE id=?";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setString(1, name);
            ps.setString(2, level);
            ps.setInt(3, id);

            ps.executeUpdate();

            System.out.println("Skill updated successfully!");

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    // DELETE
    public void deleteSkill(int id) {

        String sql = "DELETE FROM skills WHERE id=?";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setInt(1, id);

            ps.executeUpdate();

            System.out.println("Skill deleted successfully!");

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}