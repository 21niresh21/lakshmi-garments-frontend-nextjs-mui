"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Grid, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import AddIcon from "@mui/icons-material/Add";
import { Skill } from "@/app/_types/Skill";
import { addSkill, fetchSkills, updateSkill } from "@/app/api/skillApi";
import SkillFormModal, { SkillFormData } from "@/app/components/shared/SkillFormModal";

export default function Page() {
  const { notify } = useNotification();

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Skill[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  /* ---------------- Fetch Transports ---------------- */

  const loadSkills = async () => {
    try {
      const data = await fetchSkills( search );
      setRows(data);
    } catch (err) {
      notify("Error fetching skills", "error");
    }
  };

  useEffect(() => {
    loadSkills();
  }, [search]);

  /* ---------------- Add / Edit Handlers ---------------- */

  const handleAddSkill = () => {
    setSelectedSkill(null); // IMPORTANT
    setOpenModal(true);
  };

  const handleEditSkill = (item: Skill) => {
    setSelectedSkill(item);
    setOpenModal(true);
  };

  const handleItemSubmit = async (data: SkillFormData) => {
    try {
      if (selectedSkill) {
        // EDIT
        await updateSkill(selectedSkill.id, data);
        notify("Item updated successfully", "success");
      } else {
        // CREATE
        await addSkill(data);
        notify("Item created successfully", "success");
      }

      setOpenModal(false);
      setSelectedSkill(null);
      loadSkills();
    } catch (err: any) {
      console.error(err);
      notify(err?.response?.data ?? "Error saving skill", "error");
    }
  };

  useEffect(() => {
    if (!openModal) {
      setSelectedSkill(null);
    }
  }, [openModal]);

  /* ---------------- Render ---------------- */

  return (
    <Grid container>
      <Grid size={12}>
        <GenericTable<Skill>
          title="Skills"
          rows={rows}
          pagination={false}
          totalCount={rows.length}
          searchPlacedHolder="Search Skills..."
          searchValue={search}
          onSearchChange={setSearch}
          columns={[
            { id: "id", label: "ID", sortable: false },
            { id: "name", label: "Skill Name", sortable: false },
          ]}
          rowActions={[
            {
              label: "Edit",
              icon: () => (
                <IconButton size="small">
                  <EditIcon sx={{ color: "gray" }} />
                </IconButton>
              ),
              onClick: (row: Skill) => handleEditSkill(row),
            },
          ]}
          toolbarExtras={[
            <IconButton key="add-skill" onClick={handleAddSkill} title="Add Skill">
              <AddIcon />
            </IconButton>,
          ]}
        />
      </Grid>

      {/* -------- Item Modal (Create + Edit) -------- */}

      <SkillFormModal
        open={openModal}
        mode={selectedSkill ? "edit" : "create"}
        initialData={
          selectedSkill
            ? {
                name: selectedSkill.name,
              }
            : undefined
        }
        onClose={() => {
          setOpenModal(false);
        }}
        onSubmit={handleItemSubmit}
      />
    </Grid>
  );
}
