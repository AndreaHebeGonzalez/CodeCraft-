import { useEffect, useState, type ReactNode } from "react";
import { lazy, Suspense } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useAppStore from "@/shared/stores/useAppStore"
import useOpenElement from "@/shared/hooks/useOpenElement"
import Header from "./components/Header/Header"
import Sidebar from "./components/Sidebar/Sidebar"
import Modal from "@/shared/components/Modal/Modal"
import AppNotification from "@/shared/components/AppNotification/AppNotification"


const ProjectForm = lazy(() =>
  import("@/modules/projects/components/ProjectForm/ProjectForm")
)

const TaskForm = lazy(() =>
  import("@/modules/tasks/components/TaskForm/TaskForm")
)

const TaskDetails = lazy(() =>
  import("@/modules/tasks/views/TaskDetails/TaskDetails")
)

const FloatingActionMenu = lazy(() =>
  import("@/shared/components/FloatingActionMenu/FloatingActionMenu")
)

import './AppLayout.scss'
import { initBreakpoints } from "@/shared/utils/breakpoint";

export default function AppLayout() {

  const location = useLocation()
  const navigate = useNavigate()

  const { openModal, isOpenModal, closeModal, isTabletTwo } = useAppStore()
  
  const { isOpen : openMenu, handleOpenElement : handleOpenMenu, closeElement : closeMenu } = useOpenElement()

  const params = new URLSearchParams(location.search)
  const modalType = params.get("modalType")
  const taskId = params.get("taskId")
  
  const scrollKey : string | undefined = modalType === 'task' && taskId ? taskId : undefined


  useEffect(() => {
    const cleanup = initBreakpoints()
    return cleanup
  }, [])

  const [modalContent, setModalContent] = useState<ReactNode | null>(null)

  useEffect(() => {
    if (!modalType) {
      setModalContent(null);
      closeModal();
      return;
    }

    switch (modalType) {
      case 'newProyect':
        setModalContent(<ProjectForm  />)
        openModal()
        break


      case 'newTask':
        setModalContent(<TaskForm />)
        openModal()
        break

      case "task":
        if (taskId) {
          setModalContent(<TaskDetails taskId={taskId} />); 
          openModal()
        }
        break

      default:
        setModalContent(null);
        closeModal()
    }
  }, [location.search])

  
  const handleCloseModal = () => {
    navigate(location.pathname)
  }

  return (
    <div className="layout">
      <Header 
        openMenu={openMenu}
        handleOpenMenu={handleOpenMenu}
      />
      <main className='main'>
        <Sidebar 
          isOpen={openMenu}
          closeMenu={closeMenu}
        />
        
        <div className="main__content">
          <Outlet />
        </div>

        <Modal 
          isOpen= {isOpenModal} 
          onClose={handleCloseModal}
          scrollKey={scrollKey}
        > 
          <Suspense>
            {modalContent}
          </Suspense>
        </Modal>

        <AppNotification />  
        
        {
          !isTabletTwo &&
          <FloatingActionMenu />
        }
        
      </main>
    </div>
  )
}
