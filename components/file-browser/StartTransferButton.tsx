import React from "react";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useTransferSettings } from "../transfer-settings-context/useTransferSettings";
import { STATIC } from "@/utils/static";
import { Flex, Spacer, Icon, Button, useToast, Link } from "@chakra-ui/react";
import { transfer, webapp } from "@globus/sdk";
import {
  ArrowTopRightOnSquareIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";

export default function StartTransferButton() {
  const transferSettings = useTransferSettings();
  const auth = useGlobusAuth();
  const toast = useToast();
  const [inflightTask, setInflightTask] = React.useState(false);

  async function handleStartTransfer() {
    if (
      !transferSettings.source ||
      !transferSettings.source_path ||
      !transferSettings.destination_path ||
      !transferSettings.destination
    ) {
      return;
    }

    setInflightTask(true);

    const id = await (
      await transfer.taskSubmission.submissionId(
        {},
        { manager: auth.authorization },
      )
    ).json();

    const response = await transfer.taskSubmission.submitTransfer(
      {
        payload: {
          submission_id: id.value,
          label: `Transfer from ${STATIC.data.attributes.content.title}`,
          source_endpoint: transferSettings.source.id,
          destination_endpoint: transferSettings.destination.id,
          DATA: transferSettings.items.map((item) => {
            return {
              DATA_TYPE: "transfer_item",
              source_path: `${transferSettings.source_path}${item.name}`,
              destination_path: `${transferSettings.destination_path}${item.name}`,
              recursive: transfer.utils.isDirectory(item),
            };
          }),
        },
      },
      { manager: auth.authorization },
    );

    const data = await response.json();

    if (response.ok) {
      toast({
        title: data.code,
        description: (
          <>
            {data.message}
            {"task_id" in data && (
              <Flex>
                <Spacer />
                <Link
                  href={webapp.urlFor("TASK", [data.task_id]).toString()}
                  isExternal
                >
                  View task in Globus Web App{" "}
                  <Icon as={ArrowTopRightOnSquareIcon} />
                </Link>
              </Flex>
            )}
          </>
        ),
        status: "success",
        isClosable: true,
      });
    } else {
      toast({
        title: `Error (${data.code})`,
        description: data.message,
        status: "error",
        isClosable: true,
      });
    }
    setInflightTask(false);
  }

  return (
    <Button
      onClick={() => handleStartTransfer()}
      isDisabled={
        !transferSettings.source ||
        !transferSettings.destination ||
        !transferSettings.items.length
      }
      leftIcon={<Icon as={PlayCircleIcon} boxSize={6} />}
      isLoading={inflightTask}
    >
      Start Transfer
    </Button>
  );
}
