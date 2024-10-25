import React from "react";
import { useGlobusAuth } from "@globus/react-auth-context";
import { STATIC } from "@/utils/static";
import { Flex, Spacer, Icon, Button, useToast, Link } from "@chakra-ui/react";
import { transfer, webapp } from "@globus/sdk";
import {
  ArrowTopRightOnSquareIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { useGlobusTransferStore } from "../store/globus-transfer";

export default function StartTransferButton() {
  const transferStore = useGlobusTransferStore();
  const auth = useGlobusAuth();
  const toast = useToast();
  const [inflightTask, setInflightTask] = React.useState(false);

  async function handleStartTransfer() {
    if (
      !transferStore.source ||
      !transferStore.source_path ||
      !transferStore.destination_path ||
      !transferStore.destination
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
          source_endpoint: transferStore.source.id,
          destination_endpoint: transferStore.destination.id,
          DATA: transferStore.items.map((item) => {
            return {
              DATA_TYPE: "transfer_item",
              source_path: `${transferStore.source_path}${item.name}`,
              destination_path: `${transferStore.destination_path}${item.name}`,
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
        !transferStore.source ||
        !transferStore.destination ||
        !transferStore.items.length
      }
      leftIcon={<Icon as={PlayCircleIcon} boxSize={6} />}
      isLoading={inflightTask}
    >
      Start Transfer
    </Button>
  );
}
