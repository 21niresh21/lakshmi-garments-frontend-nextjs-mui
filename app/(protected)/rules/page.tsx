"use client";

import { ReactNode, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { JSX } from "@emotion/react/jsx-runtime";
import { Circle } from "@mui/icons-material";

type RuleTag =
  | "Invoice"
  | "Batch"
  | "Jobwork"
  | "Approval"
  | "Immutable"
  | "Edit"
  | "Accounts Admin"
  | "Super Admin"
  | "Create"
  | "Cutting"
  | "Out pass";

interface Rule {
  id: string;
  title: string;
  description: ReactNode;
  tags: RuleTag[];
}

const TAG_COLOR_MAP: Record<
  RuleTag,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  Invoice: "info",
  Batch: "secondary",
  Jobwork: "success",
  Approval: "warning",
  Immutable: "error",
  Edit: "error",
  "Accounts Admin": "default",
  "Super Admin": "secondary",
  Create: "success",
  Cutting: "primary",
  "Out pass": "warning",
};

type RuleSection = Record<string, Rule[]>;

const cardHoverAnimation: Variants = {
  rest: { rotateX: 0, rotateY: 0, scale: 1 },
  hover: {
    rotateX: -6,
    rotateY: 6,
    scale: 1.04,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const MotionCard = motion(Card);

// ------------------
// Hardcoded Rules
// ------------------
const RULES: RuleSection = {
  Invoice: [
    {
      id: "INV-01",
      title: "General Information on Creating Invoice",
      description: (
        <Box component="div" mt={1}>
          <ul
            style={{
              paddingLeft: 16,
              margin: 0,
              listStyleType: "disc",
              lineHeight: 1.8,
            }}
          >
            <li>
              <strong>Invoice Number:</strong> Can be any text you want to type.
            </li>
            <li>
              <strong>Invoice Date / Received Date:</strong> Cannot select
              future dates.
            </li>
            <li>
              <strong>Transport Cost:</strong> Optional. Defaults to{" "}
              <strong>0</strong> if left empty.
            </li>
            <li>
              <strong>Transport Paid:</strong> Not paid by default. If transport
              cost is <strong>0</strong>, it will be considered paid
              automatically.
            </li>
            <li>
              <strong>LR Number:</strong> If you don’t have one, system
              generates automatically when selecting{" "}
              <Chip
                label="SELF"
                size="small"
                variant="filled"
                sx={{ mx: 0.5 }}
              />{" "}
              option.
            </li>
            <li>
              Any number of{" "}
              <Chip
                label="Lorry Receipts"
                size="small"
                variant="filled"
                sx={{ mx: 0.5 }}
              />{" "}
              and{" "}
              <Chip
                label="Bales"
                size="small"
                variant="filled"
                sx={{ mx: 0.5 }}
              />{" "}
              can be added per invoice.
            </li>
            <li>
              <strong>Save Draft:</strong> Saves all details entered so far on
              the device. Drafts are only saved when you explicitly click{" "}
              <Chip
                label="Save Draft"
                size="small"
                variant="filled"
                sx={{ mx: 0.5 }}
              />
              .
            </li>
            <li>
              Drafts are cleared automatically upon successful submission or if
              the form is cleared manually.
            </li>
          </ul>
        </Box>
      ),
      tags: ["Invoice", "Accounts Admin", "Create"],
    },
    {
      id: "INV-02",
      title: "Invoice Editing allowed for 1 hour only",
      description: (
        <Box component="div" mt={1}>
          <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
            <li>
              Invoice details can be edited anytime by{" "}
              <strong>Accounts Admin</strong>.
            </li>
            <li>
              <strong>Lorry Receipt</strong> and <strong>bale details</strong>{" "}
              editable only for 1 hour.
            </li>
            <li style={{ color: "#d32f2f", fontWeight: 500 }}>
              After 1 hour, edits require <strong>Super Admin</strong> support.
            </li>
            <p>
              <strong style={{ marginTop: 15 }}>
                Careful Attention is needed when editing the bale quantities, as
                these can corrupt the stock levels. BATCH CREATION of wrong bale
                quantity needs to be avoided
              </strong>
            </p>
          </ul>
        </Box>
      ),

      tags: ["Invoice", "Edit", "Accounts Admin", "Super Admin"],
    },
  ],
  Batch: [
    {
      id: "BA-01",
      title: "General Information on Creating a Batch",
      description: (
        <Box component="div" mt={1}>
          <ul
            style={{
              paddingLeft: 16,
              margin: 0,
              listStyleType: "disc",
              lineHeight: 1.8,
            }}
          >
            <li>
              To create a batch, you must select a{" "}
              <Chip
                label="Category"
                size="small"
                variant="filled"
                sx={{ mx: 0.5 }}
              />
              and one or more{" "}
              <Chip
                label="Sub Categories"
                size="small"
                variant="filled"
                sx={{ mx: 0.5 }}
              />
              along with the quantity required from each sub category.
            </li>

            <li>
              <strong>Serial Code:</strong> The batch serial code is generated
              automatically by the system.
            </li>

            <li>
              <strong>Remarks:</strong> You can enter any information or notes
              related to the batch.
            </li>

            <li>
              <strong>Urgency:</strong> If the batch needs priority processing,
              enable the{" "}
              <Chip
                label="Urgent"
                size="small"
                variant="filled"
                sx={{ mx: 0.5 }}
              />
              switch while creating the batch.
            </li>

            <li>
              Upon successful creation, the batch status will be set to{" "}
              <Chip
                label="CREATED"
                size="small"
                variant="filled"
                sx={{ mx: 0.5 }}
              />
              .
            </li>
          </ul>
        </Box>
      ),
      tags: ["Batch", "Create"],
    },
  ],
  Jobwork: [
    {
      id: "JW-01",
      title: "General Information on Out Pass of CUTTING Jobwork",
      description: (
        <Box component="div" mt={1}>
          <ul
            style={{
              paddingLeft: 16,
              margin: 0,
              listStyleType: "disc",
              lineHeight: 1.8,
            }}
          >
            <li>
              <strong>Jobwork Details:</strong> Select{" "}
              <Chip
                label="Batch"
                size="small"
                variant="filled"
                sx={{ mx: 0.5 }}
              />
              ,{" "}
              <Chip
                label="Employee"
                size="small"
                variant="filled"
                sx={{ mx: 0.5 }}
              />
              , and{" "}
              <Chip
                label="Jobwork Type"
                size="small"
                variant="filled"
                sx={{ mx: 0.5 }}
              />{" "}
              ("Cutting").
            </li>
            <li>
              <strong>Jobwork Number:</strong> System-generated. Must be entered
              when accepting the jobwork in the{" "}
              <Chip
                label="In Pass"
                size="small"
                variant="filled"
                sx={{ mx: 0.5 }}
              />{" "}
              process.
            </li>
            <li>
              <strong>Batch Status:</strong> Once assigned, the batch status
              changes to{" "}
              <Chip
                label="ASSIGNED"
                size="small"
                variant="filled"
                sx={{ mx: 0.5 }}
              />{" "}
              and the jobwork status becomes{" "}
              <Chip
                label="IN_PROGRESS"
                size="small"
                variant="filled"
                sx={{ mx: 0.5 }}
              />
              .
            </li>
            <li>
              <strong>Quantity Limits:</strong> The currently available
              quantities for the batch are the maximum you can assign to this
              jobwork.
            </li>
            <li>
              <strong>Remarks:</strong> Mention items required out of this
              jobwork.
            </li>
            <li>
              <strong>Assign:</strong> Clicking <strong>Assign</strong> will
              create a new jobwork record.
            </li>
            <li>
              <strong>Print:</strong> Make sure to print the jobwork before
              submitting to the system.
            </li>
          </ul>
        </Box>
      ),
      tags: ["Jobwork", "Batch", "Cutting", "Out pass"],
    },
    {
      id: "JW-02",
      title: "Which Batches Can Be Used for Jobwork ?",
      description: (
        <Box component="div" mt={1}>
          <ul
            style={{
              paddingLeft: 16,
              margin: 0,
              listStyleType: "disc",
              lineHeight: 1.8,
            }}
          >
            <li>
              Batches with status{" "}
              <Chip
                label="CLOSED"
                size="small"
                variant="filled"
                sx={{ mx: 0.5 }}
              />{" "}
              or{" "}
              <Chip
                label="DISCARDED"
                size="small"
                variant="filled"
                sx={{ mx: 0.5 }}
              />{" "}
              are <strong>not eligible</strong> for creating any jobwork.
            </li>

            <li>
              All other batch statuses are eligible and can be selected while
              creating a jobwork.
            </li>
          </ul>
        </Box>
      ),
      tags: ["Jobwork", "Batch"],
    },
    {
      id: "JW-03",
      title: "What Determines the Allowed Jobwork Types for a Batch",
      description: (
        <Box component="div" mt={1}>
          <ul
            style={{
              paddingLeft: 16,
              margin: 0,
              listStyleType: "disc",
              lineHeight: 1.8,
            }}
          >
            <li>
              The system determines allowed jobwork types based on the batch’s
              <strong> quantity usage</strong>,{" "}
              <strong>previous jobworks</strong>, and <strong>damages</strong>.
            </li>

            <li>
              <strong>
                <Chip
                  label="CUTTING"
                  size="small"
                  variant="filled"
                  sx={{ mx: 0.5 }}
                />
              </strong>
              is allowed only if the following value is greater than{" "}
              <strong>0</strong>:
              <br />
              <em>
                Initial Batch Quantity − Total Cutting Assigned Quantity +
                Repairable Damages
              </em>
            </li>

            <li>
              If the remaining quantity for cutting becomes{" "}
              <strong>0 or less</strong>, further cutting jobworks are not
              allowed for that batch.
            </li>

            <li>
              <strong>
                <Chip
                  label="STITCHING"
                  size="small"
                  variant="filled"
                  sx={{ mx: 0.5 }}
                />
              </strong>
              is allowed only if there is at least{" "}
              <strong>one accepted cutting jobwork</strong> for the batch with
              accepted quantity greater than <strong>0</strong>.
            </li>

            <li>
              Stitching is considered <strong>closed</strong> when the sum of
              the following matches the total batch items:
              <br />
              <em>
                Accepted Stitching Quantities + Supplier Damages + Unrepairable
                Damages + Sales
              </em>
            </li>

            <li>
              <strong>
                <Chip
                  label="PACKAGING"
                  size="small"
                  variant="filled"
                  sx={{ mx: 0.5 }}
                />
              </strong>
              follows the same eligibility and closure rules as{" "}
              <strong>Stitching</strong>.
            </li>
          </ul>
        </Box>
      ),
      tags: ["Jobwork", "Batch"],
    },
  ],
};

// ------------------
// Component
// ------------------
export default function RulesPage(): JSX.Element {
  const [activeRule, setActiveRule] = useState<Rule | null>(null);

  return (
    <Box px={{ xs: 2, sm: 4 }} py={4}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Rules & Policies
      </Typography>
      <Typography color="text.secondary" mb={4}>
        These rules define how the system behaves.
      </Typography>

      {Object.entries(RULES).map(([section, rules]) => (
        <Box key={section} mb={6}>
          <Typography variant="h5" fontWeight={500} gutterBottom>
            {section} Rules
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {rules.map((rule) => (
              <Grid
                key={rule.id}
                size={{ xs: 12, sm: 6, md: 4 }}
                sx={{ perspective: 1200 }}
              >
                <MotionCard
                  variants={cardHoverAnimation}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  onClick={() => setActiveRule(rule)}
                  sx={{
                    cursor: "pointer",
                    height: "100%",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <CardContent>
                    {/* Header row */}
                    <Stack
                      direction="row"
                      alignItems="flex-start"
                      spacing={1}
                      flexWrap="wrap"
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 600 }}
                      >
                        {rule.id}
                      </Typography>

                      <Box sx={{ flexGrow: 1 }} />

                      {/* Tags */}
                      <Stack
                        direction="row"
                        flexWrap="wrap"
                        justifyContent="flex-end"
                        gap={1}
                        sx={{ maxWidth: "90%" }}
                      >
                        {rule.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            color={TAG_COLOR_MAP[tag]}
                          />
                        ))}
                      </Stack>
                    </Stack>

                    <Typography variant="subtitle1" fontWeight={600} mt={3}>
                      {rule.title}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Expanded Rule View */}
      <AnimatePresence>
        {activeRule && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1300,
              padding: 16,
            }}
            onClick={() => setActiveRule(null)}
          >
            <Card
              sx={{
                width: "100%",
                maxWidth: 700,
                maxHeight: "90vh", // 👈 key
                overflowY: "auto", // 👈 key
                p: { xs: 2, sm: 4 },
                borderRadius: 3,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                {activeRule.id}
              </Typography>
              <Typography variant="h6" fontWeight={600} mt={1}>
                {activeRule.title}
              </Typography>
              {activeRule.description}

              <Box mt={4} textAlign="right">
                <Button
                  sx={{ cursor: "pointer" }}
                  color="primary"
                  onClick={() => setActiveRule(null)}
                  variant="contained"
                >
                  Close
                </Button>
              </Box>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
