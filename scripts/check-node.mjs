const [major,minor]=process.versions.node.split('.').map(Number);
if(major<22||(major===22&&minor<13)){console.error('SPOT IT requires Node.js 22.13 or later. Installed version: '+process.versions.node);process.exit(1);}
