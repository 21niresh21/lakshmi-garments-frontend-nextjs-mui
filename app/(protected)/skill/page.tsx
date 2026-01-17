"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Grid, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { Skill } from "@/app/_types/Skill";
import { addSkill, fetchSkills, updateSkill } from "@/app/api/skillApi";
import SkillFormModal, {
  SkillFormData,
} from "@/app/components/shared/SkillFormModal";
import { useGlobalLoading } from "@/app/components/layout/LoadingProvider";

/* ---------------- Error Normalizer ---------------- */

function normalizeError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response?.data === "string"
  ) {
    return (error as any).response.data;
  }
  return "Something went wrong. Please try again.";
}

export default function Page() {
  const { notify } = useNotification();
  const { showLoading, hideLoading } = useGlobalLoading();

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Skill[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- Fetch Skills ---------------- */

  const loadSkills = useCallback(
    async (query: string) => {
      showLoading();
      try {
        const data = await fetchSkills(query);
        setRows(data ?? []);
      } catch (err) {
        notify(normalizeError(err), "error");
      } finally {
        hideLoading();
      }
    },
    [notify, showLoading, hideLoading]
  );

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => loadSkills(search), 400);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [search, loadSkills]);

  /* ---------------- Add / Edit ---------------- */

  const handleAddSkill = useCallback(() => {
    setSelectedSkill(null);
    setOpenModal(true);
  }, []);

  const handleEditSkill = useCallback((skill: Skill) => {
    setSelectedSkill(skill);
    setOpenModal(true);
  }, []);

  const handleSkillSubmit = useCallback(
    async (data: SkillFormData) => {
      showLoading();
      try {
        if (selectedSkill) {
          await updateSkill(selectedSkill.id, data);
          notify("Skill updated successfully", "success");
        } else {
          await addSkill(data);
          notify("Skill created successfully", "success");
        }

        setOpenModal(false);
        loadSkills(search);
      } catch (err) {
        console.error(err);
        notify(normalizeError(err), "error");
      } finally {
        hideLoading();
      }
    },
    [selectedSkill, notify, loadSkills, search, showLoading, hideLoading]
  );

  /* ---------------- Memoized Table Config ---------------- */

  const columns = useMemo(
    () => [
      { id: "id", label: "ID", sortable: false },
      { id: "name", label: "Skill Name", sortable: false },
    ],
    []
  );

  const rowActions = useMemo(
    () => [
      {
        label: "Edit",
        icon: () => (
          <IconButton size="small">
            <EditIcon sx={{ color: "gray" }} />
          </IconButton>
        ),
        onClick: (row: Skill) => handleEditSkill(row),
      },
    ],
    [handleEditSkill]
  );

  const toolbarExtras = useMemo(
    () => [
      <IconButton key="add-skill" onClick={handleAddSkill} title="Add Skill">
        <AddIcon />
      </IconButton>,
    ],
    [handleAddSkill]
  );

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
          columns={columns}
          rowActions={rowActions}
          toolbarExtras={toolbarExtras}
        />
      </Grid>

      {/* -------- Skill Modal (Create + Edit) -------- */}

      <SkillFormModal
        open={openModal}
        mode={selectedSkill ? "edit" : "create"}
        initialData={selectedSkill ? { name: selectedSkill.name } : undefined}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSkillSubmit}
      />
    </Grid>
  );
}
