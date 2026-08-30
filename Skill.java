package com.careerspherex.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class Skill {

    // CREATE
    public void createSkill(String name, String level) {

        try {

            Connection con = DBConnection.getConnection();

            String sql = "INSERT INTO skills(name, level) VALUES (?, ?)";

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setString(1, name);
            ps.setString(2, level);

            ps.executeUpdate();

            System.out.println("Skill Added Successfully!");

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    // READ
    public void readSkills() {

        try {

            Connection con = DBConnection.getConnection();

            String sql = "SELECT * FROM skills";

            PreparedStatement ps = con.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();

            System.out.println("\nID | NAME | LEVEL");
            System.out.println("---------------------");

            while (rs.next()) {

                System.out.println(
                    rs.getInt("id") + " | " +
                    rs.getString("name") + " | " +
                    rs.getString("level")
                );
            }

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    // UPDATE
    public void updateSkill(int id, String name, String level) {

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                "UPDATE skills SET name=?, level=? WHERE id=?";

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setString(1, name);
            ps.setString(2, level);
            ps.setInt(3, id);

            ps.executeUpdate();

            System.out.println("Skill Updated Successfully!");

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    // DELETE
    public void deleteSkill(int id) {

        try {

            Connection con = DBConnection.getConnection();

            String sql = "DELETE FROM skills WHERE id=?";

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setInt(1, id);

            ps.executeUpdate();

            System.out.println("Skill Deleted Successfully!");

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}